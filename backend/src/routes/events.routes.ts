import { Router } from "express";
import { EventType, MembershipStatus } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { toPublicEvent } from "../lib/catalog-public";
import { PERMISSIONS } from "../lib/rbac";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, optionalAuth, requireAuth, requireRole } from "../middleware/auth";

export const eventsRouter = Router();

eventsRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const manage = req.query.manage === "1";
    const canManage =
      manage && req.user && PERMISSIONS.manageEvents.includes(req.user.role);

    const events = await prisma.event.findMany({
      where: canManage ? undefined : { published: true },
      include: {
        _count: {
          select: { registrations: { where: { status: { in: ["PENDING", "APPROVED"] } } } },
        },
        ...(canManage && {
          registrations: {
            include: {
              user: {
                include: { membership: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        }),
      },
      orderBy: { startAt: "asc" },
    });

    let userRegistrations = new Map<string, string>();

    if (req.user) {
      const registrations = await prisma.eventRegistration.findMany({
        where: { userId: req.user.id },
        select: { eventId: true, status: true },
      });
      userRegistrations = new Map(registrations.map((row) => [row.eventId, row.status]));
    }

    res.json({
      events: events.map((event) =>
        toPublicEvent(event, { 
          registered: userRegistrations.has(event.id),
          registrationStatus: userRegistrations.get(event.id)
        }),
      ),
    });
  }),
);

eventsRouter.post(
  "/",
  requireAuth,
  requireRole(...PERMISSIONS.manageEvents),
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      type?: string;
      speaker?: string;
      startAt?: string;
      endAt?: string;
      location?: string;
      meetingLink?: string;
      maxPlaces?: number;
      posterUrl?: string;
      published?: boolean;
    };

    if (!body.title?.trim() || !body.description?.trim() || !body.type?.trim() || !body.startAt) {
      throw new ApiError(400, "Titre, description, type et date de début sont requis");
    }

    const startAt = new Date(body.startAt);
    if (Number.isNaN(startAt.getTime())) {
      throw new ApiError(400, "Date de début invalide");
    }

    const endAt = body.endAt ? new Date(body.endAt) : null;
    if (endAt && Number.isNaN(endAt.getTime())) {
      throw new ApiError(400, "Date de fin invalide");
    }

    const maxPlaces = Number(body.maxPlaces ?? 50);
    if (!Number.isFinite(maxPlaces) || maxPlaces < 1) {
      throw new ApiError(400, "Capacité invalide");
    }

    const validTypes = Object.values(EventType);
    const type = body.type?.trim().toUpperCase() as EventType;
    if (!validTypes.includes(type)) {
      throw new ApiError(400, "Type d'événement invalide");
    }

    const event = await prisma.event.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        type,
        speaker: body.speaker?.trim() || null,
        startAt,
        endAt,
        location: body.location?.trim() || null,
        meetingLink: body.meetingLink?.trim() || null,
        maxPlaces,
        posterUrl: body.posterUrl?.trim() || null,
        published: body.published ?? true,
      },
      include: {
        _count: {
          select: { registrations: { where: { status: { in: ["PENDING", "APPROVED"] } } } },
        },
      },
    });

    res.status(201).json({ event: toPublicEvent(event) });
  }),
);

eventsRouter.post(
  "/:eventId/register",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const eventIdParam = req.params.eventId;
    if (!eventIdParam || Array.isArray(eventIdParam)) {
      throw new ApiError(400, "Identifiant invalide");
    }
    const eventId = eventIdParam;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { membership: true },
    });

    if (user?.membership?.status !== MembershipStatus.ACTIVE) {
      throw new ApiError(403, "Seuls les membres actifs peuvent s'inscrire à un événement");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: { where: { status: { in: ["PENDING", "APPROVED"] } } } },
        },
      },
    });

    if (!event || !event.published) {
      throw new ApiError(404, "Événement introuvable");
    }

    if (event._count.registrations >= event.maxPlaces) {
      throw new ApiError(409, "Plus de places disponibles pour cet événement");
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId, userId: req.user!.id },
      },
    });

    if (existing) {
      throw new ApiError(409, "Vous êtes déjà inscrit à cet événement");
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ registered: true, status: registration.status });
  }),
);

eventsRouter.patch(
  "/:eventId/registrations/:userId/validate",
  requireAuth,
  requireRole(...PERMISSIONS.manageEvents),
  asyncHandler(async (req: AuthRequest, res) => {
    const { eventId, userId } = req.params;
    const body = req.body as { action?: "approve" | "reject" };

    if (!body.action || !["approve", "reject"].includes(body.action)) {
      throw new ApiError(400, "Action invalide. Utilisez 'approve' ou 'reject'");
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: String(eventId), userId: String(userId) } },
    });

    if (!registration) {
      throw new ApiError(404, "Inscription introuvable");
    }

    const status = body.action === "approve" ? "APPROVED" : "REJECTED";

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status },
    });

    res.json({ success: true, status });
  }),
);
