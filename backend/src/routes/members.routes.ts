import { Router } from "express";
import { MembershipStatus, Role } from "@prisma/client";
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
  filiere: string | null;
  niveau: string | null;
  membership: { memberId: string | null; status: MembershipStatus } | null;
}) {
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    filiere: member.filiere ?? "",
    niveau: member.niveau ?? "",
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
  matricule: string | null;
  filiere: string | null;
  niveau: string | null;
  phone: string | null;
  createdAt: Date;
  membership: { academicYear: string } | null;
}) {
  return {
    id: member.id,
    email: member.email,
    firstName: member.firstName,
    lastName: member.lastName,
    matricule: member.matricule ?? "",
    filiere: member.filiere ?? "",
    niveau: member.niveau ?? "",
    phone: member.phone ?? "",
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

const BUREAU_ORDER: Role[] = [
  Role.ADMINISTRATEUR,
  Role.RESPONSABLE,
  Role.TRESORIER,
  Role.FORMATEUR,
];

const TITLE_ORDER: string[] = [
  "président",
  "coordinateur",
  "1er chargé à l'organisation",
  "2ème chargé à l'organisation",
  "3ème chargé à l'organisation",
  "4ème chargé à l'organisation",
  "chargée à l'information et la communication",
  "1ère chargée aux formations",
  "2ème chargé aux formations",
  "3ème chargé aux formations",
  "1ère chargée aux ressources humaines",
  "2ème chargée aux ressources humaines",
  "trésorière"
];

membersRouter.get(
  "/bureau",
  asyncHandler(async (_req, res) => {
    const bureau = await prisma.user.findMany({
      where: {
        role: { not: Role.MEMBRE },
        membership: { status: MembershipStatus.ACTIVE },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        filiere: true,
        bureauTitle: true,
      },
    });

    const sorted = [...bureau].sort((a, b) => {
      const titleA = a.bureauTitle?.toLowerCase() || "";
      const titleB = b.bureauTitle?.toLowerCase() || "";
      
      const indexA = TITLE_ORDER.indexOf(titleA);
      const indexB = TITLE_ORDER.indexOf(titleB);
      
      const weightA = indexA === -1 ? 999 : indexA;
      const weightB = indexB === -1 ? 999 : indexB;

      if (weightA !== weightB) {
        return weightA - weightB;
      }

      return BUREAU_ORDER.indexOf(a.role) - BUREAU_ORDER.indexOf(b.role);
    });

    res.json({
      bureau: sorted.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        bio: user.bio,
        bureauTitle: user.bureauTitle,
        filiere: user.filiere,
        initials: `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase(),
      })),
    });
  }),
);

membersRouter.get(
  "/anciens-bureaux",
  asyncHandler(async (_req, res) => {
    const mandates = await prisma.bureauMandate.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        academicYear: "desc",
      },
    });

    res.json({
      anciensBureaux: mandates.map((m) => ({
        id: m.id,
        academicYear: m.academicYear,
        role: m.role,
        bureauTitle: m.bureauTitle,
        legacyBio: m.legacyBio,
        user: {
          id: m.user.id,
          firstName: m.user.firstName,
          lastName: m.user.lastName,
          initials: `${m.user.firstName[0] ?? ""}${m.user.lastName[0] ?? ""}`.toUpperCase(),
        },
      })),
    });
  }),
);

membersRouter.get(
  "/mon-heritage",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const mandates = await prisma.bureauMandate.findMany({
      where: { userId: req.user!.id }
    });

    if (mandates.length === 0) {
      res.json({ eligible: false, legacyBio: null });
      return;
    }

    res.json({ eligible: true, legacyBio: mandates[0].legacyBio });
  })
);

membersRouter.patch(
  "/mon-heritage",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const { legacyBio } = req.body;
    
    const count = await prisma.bureauMandate.count({
      where: { userId: req.user!.id }
    });

    if (count === 0) {
      throw new ApiError(403, "Vous ne faites partie d'aucun ancien bureau.");
    }

    await prisma.bureauMandate.updateMany({
      where: { userId: req.user!.id },
      data: { legacyBio: legacyBio?.trim() || null },
    });

    res.json({ success: true, legacyBio });
  })
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
