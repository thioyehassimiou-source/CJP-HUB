import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { toPublicResource } from "../lib/projects-public";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireActiveMember } from "../middleware/membership";
import { type AuthRequest, requireAuth, optionalAuth } from "../middleware/auth";
import type { Prisma } from "@prisma/client";
import { ResourceLevel, ResourceType } from "@prisma/client";

export const resourcesRouter = Router();

// GET /resources - List resources with filters
resourcesRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const { category, type, level, search, tags } = req.query;

    const where: Prisma.ResourceWhereInput = { isPublished: true };

    if (typeof category === "string" && category) {
      where.category = category;
    }

    if (typeof type === "string" && type && Object.values(ResourceType).includes(type as ResourceType)) {
      where.type = type as ResourceType;
    }

    if (typeof level === "string" && level && Object.values(ResourceLevel).includes(level as ResourceLevel)) {
      where.level = level as ResourceLevel;
    }

    if (typeof search === "string" && search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (typeof tags === "string" && tags) {
      const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        where.tags = { hasSome: tagList };
      }
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let userFavorites = new Set<string>();
    if (req.user) {
      const favorites = await prisma.userFavorite.findMany({
        where: { userId: req.user.id },
        select: { resourceId: true },
      });
      userFavorites = new Set(favorites.map((f) => f.resourceId));
    }

    res.json({ resources: resources.map(r => toPublicResource(r, req.user?.id, userFavorites)) });
  }),
);

// GET /resources/favorites/me - Get current user's favorite resources
resourcesRouter.get(
  "/favorites/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const favorites = await prisma.userFavorite.findMany({
      where: { userId: req.user!.id },
      include: {
        resource: {
          include: {
            uploadedBy: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const userFavorites = new Set(favorites.map((f) => f.resourceId));

    res.json({
      resources: favorites.map((f) => toPublicResource(f.resource, req.user!.id, userFavorites)),
    });
  }),
);

// GET /resources/:id - Get resource details and increment view count
resourcesRouter.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const resourceId = String(req.params.id);

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!resource || !resource.isPublished) {
      throw new ApiError(404, "Ressource introuvable");
    }

    // Increment view count
    await prisma.resource.update({
      where: { id: resourceId },
      data: { viewCount: { increment: 1 } },
    });
    
    resource.viewCount += 1;

    let userFavorites = new Set<string>();
    if (req.user) {
      const favorite = await prisma.userFavorite.findUnique({
        where: { userId_resourceId: { userId: req.user.id, resourceId } },
      });
      if (favorite) {
        userFavorites.add(resourceId);
      }
    }

    res.json({ resource: toPublicResource(resource, req.user?.id, userFavorites) });
  }),
);

// POST /resources - Create new resource
resourcesRouter.post(
  "/",
  requireAuth,
  requireActiveMember,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      type?: string;
      category?: string;
      subCategory?: string;
      author?: string;
      fileUrl?: string;
      externalUrl?: string;
      coverUrl?: string;
      level?: string;
      tags?: string[];
    };

    if (!body.title?.trim() || !body.category?.trim() || !body.type?.trim()) {
      throw new ApiError(400, "Titre, catégorie et type sont requis");
    }

    if (!Object.values(ResourceType).includes(body.type as ResourceType)) {
      throw new ApiError(400, "Type de ressource invalide");
    }

    if (!body.fileUrl?.trim() && !body.externalUrl?.trim()) {
      throw new ApiError(400, "Un lien fichier ou externe est requis");
    }

    const level = body.level && Object.values(ResourceLevel).includes(body.level as ResourceLevel)
      ? (body.level as ResourceLevel)
      : ResourceLevel.DEBUTANT;

    const resource = await prisma.resource.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        type: body.type as ResourceType,
        category: body.category.trim(),
        subCategory: body.subCategory?.trim() || null,
        author: body.author?.trim() || null,
        fileUrl: body.fileUrl?.trim() || null,
        externalUrl: body.externalUrl?.trim() || null,
        coverUrl: body.coverUrl?.trim() || null,
        level,
        tags: Array.isArray(body.tags) ? body.tags.map(t => String(t).trim()).filter(Boolean) : [],
        uploadedById: req.user!.id,
      },
      include: {
        uploadedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json({ resource: toPublicResource(resource, req.user!.id, new Set()) });
  }),
);

// POST /resources/:id/favorite - Toggle favorite status
resourcesRouter.post(
  "/:id/favorite",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const resourceId = String(req.params.id);
    const userId = req.user!.id;

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new ApiError(404, "Ressource introuvable");
    }

    const existingFavorite = await prisma.userFavorite.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    });

    if (existingFavorite) {
      await prisma.$transaction([
        prisma.userFavorite.delete({
          where: { userId_resourceId: { userId, resourceId } },
        }),
        prisma.resource.update({
          where: { id: resourceId },
          data: { favoriteCount: { decrement: 1 } },
        }),
      ]);
      res.json({ isFavorite: false, favoriteCount: resource.favoriteCount - 1 });
    } else {
      await prisma.$transaction([
        prisma.userFavorite.create({
          data: { userId, resourceId },
        }),
        prisma.resource.update({
          where: { id: resourceId },
          data: { favoriteCount: { increment: 1 } },
        }),
      ]);
      res.json({ isFavorite: true, favoriteCount: resource.favoriteCount + 1 });
    }
  }),
);

// DELETE /resources/:id - Delete a resource
resourcesRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const resourceId = String(req.params.id);

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new ApiError(404, "Ressource introuvable");
    }

    // Only allow admin or the uploader to delete
    if (req.user!.role !== "ADMINISTRATEUR" && resource.uploadedById !== req.user!.id) {
      throw new ApiError(403, "Accès refusé");
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    res.status(204).end();
  }),
);
