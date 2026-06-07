import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { toPublicFormation } from "../lib/catalog-public";
import { PERMISSIONS } from "../lib/rbac";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, optionalAuth, requireAuth, requireRole } from "../middleware/auth";

export const formationsRouter = Router();

formationsRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const manage = req.query.manage === "1";
    const canManage =
      manage && req.user && PERMISSIONS.manageFormations.includes(req.user.role);

    const formations = await prisma.formation.findMany({
      where: canManage ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ formations: formations.map(toPublicFormation) });
  }),
);

formationsRouter.post(
  "/",
  requireAuth,
  requireRole(...PERMISSIONS.manageFormations),
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      level?: string;
      program?: string;
      resources?: string;
      published?: boolean;
    };

    if (!body.title?.trim() || !body.description?.trim() || !body.level?.trim() || !body.program?.trim()) {
      throw new ApiError(400, "Titre, description, niveau et programme sont requis");
    }

    const formation = await prisma.formation.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        level: body.level.trim(),
        program: body.program.trim(),
        resources: body.resources?.trim() || null,
        published: body.published ?? true,
      },
    });

    res.status(201).json({ formation: toPublicFormation(formation) });
  }),
);
