import { Router } from "express";
import { MembershipStatus } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { generateMemberId } from "../lib/member-id";
import { prisma } from "../lib/prisma";
import { PERMISSIONS } from "../lib/rbac";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth, requireRole } from "../middleware/auth";

export const membersRouter = Router();

function toMemberSummary(member: {
  id: string;
  firstName: string;
  lastName: string;
  filiere: string;
  niveau: string;
  membership: { memberId: string | null; status: MembershipStatus } | null;
}) {
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    filiere: member.filiere,
    niveau: member.niveau,
    memberId: member.membership?.memberId ?? null,
    status: member.membership?.status ?? MembershipStatus.PENDING,
    initials: `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase(),
  };
}

function toPendingSummary(member: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  filiere: string;
  niveau: string;
  phone: string;
  createdAt: Date;
  membership: { academicYear: string } | null;
}) {
  return {
    id: member.id,
    email: member.email,
    firstName: member.firstName,
    lastName: member.lastName,
    matricule: member.matricule,
    filiere: member.filiere,
    niveau: member.niveau,
    phone: member.phone,
    academicYear: member.membership?.academicYear ?? null,
    createdAt: member.createdAt.toISOString(),
    initials: `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase(),
  };
}

membersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const members = await prisma.user.findMany({
      where: {
        membership: {
          status: MembershipStatus.ACTIVE,
        },
      },
      include: { membership: true },
      orderBy: { lastName: "asc" },
    });

    res.json({
      members: members.map(toMemberSummary),
    });
  }),
);

membersRouter.get(
  "/pending",
  requireAuth,
  requireRole(...PERMISSIONS.manageMembers),
  asyncHandler(async (_req, res) => {
    const members = await prisma.user.findMany({
      where: {
        membership: {
          status: MembershipStatus.PENDING,
        },
      },
      include: { membership: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      pending: members.map(toPendingSummary),
    });
  }),
);

membersRouter.patch(
  "/:userId/validate",
  requireAuth,
  requireRole(...PERMISSIONS.manageMembers),
  asyncHandler(async (req: AuthRequest, res) => {
    const userIdParam = req.params.userId;
    if (!userIdParam || Array.isArray(userIdParam)) {
      throw new ApiError(400, "Identifiant invalide");
    }
    const userId = userIdParam;
    const { action, rejectionReason } = req.body as {
      action?: "approve" | "reject";
      rejectionReason?: string;
    };

    if (action !== "approve" && action !== "reject") {
      throw new ApiError(400, "Action invalide (approve ou reject attendu)");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { membership: true },
    });

    if (!user?.membership) {
      throw new ApiError(404, "Candidature introuvable");
    }

    if (user.membership.status !== MembershipStatus.PENDING) {
      throw new ApiError(409, "Cette candidature a déjà été traitée");
    }

    if (action === "reject") {
      const updated = await prisma.membership.update({
        where: { userId },
        data: {
          status: MembershipStatus.REJECTED,
          rejectionReason: rejectionReason?.trim() || null,
          validatedAt: new Date(),
          validatedById: req.user!.id,
        },
      });

      res.json({
        membership: {
          status: updated.status,
          rejectionReason: updated.rejectionReason,
        },
      });
      return;
    }

    const memberId = await generateMemberId(user.membership.academicYear);

    const updated = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.update({
        where: { userId },
        data: {
          status: MembershipStatus.ACTIVE,
          memberId,
          validatedAt: new Date(),
          validatedById: req.user!.id,
          rejectionReason: null,
        },
      });

      const existingCotisation = await tx.cotisation.findFirst({
        where: {
          userId,
          academicYear: user.membership!.academicYear,
        },
      });

      if (!existingCotisation) {
        await tx.cotisation.create({
          data: {
            userId,
            amount: 50000,
            academicYear: user.membership!.academicYear,
          },
        });
      }

      return membership;
    });

    res.json({
      membership: {
        status: updated.status,
        memberId: updated.memberId,
      },
    });
  }),
);
