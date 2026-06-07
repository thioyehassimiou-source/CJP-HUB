import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { toPublicResource } from "../lib/projects-public";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireActiveMember } from "../middleware/membership";
import { type AuthRequest, requireAuth } from "../middleware/auth";

export const resourcesRouter = Router();

resourcesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category.trim() : undefined;

    const resources = await prisma.resource.findMany({
      where: category ? { category } : undefined,
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ resources: resources.map(toPublicResource) });
  }),
);

resourcesRouter.post(
  "/",
  requireAuth,
  requireActiveMember,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      category?: string;
      fileUrl?: string;
      externalUrl?: string;
    };

    if (!body.title?.trim() || !body.category?.trim()) {
      throw new ApiError(400, "Titre et catégorie sont requis");
    }

    if (!body.fileUrl?.trim() && !body.externalUrl?.trim()) {
      throw new ApiError(400, "Un lien fichier ou externe est requis");
    }

    const resource = await prisma.resource.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        category: body.category.trim(),
        fileUrl: body.fileUrl?.trim() || null,
        externalUrl: body.externalUrl?.trim() || null,
        uploadedById: req.user!.id,
      },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json({ resource: toPublicResource(resource) });
  }),
);
