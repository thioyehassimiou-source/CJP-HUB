import { Router } from "express";
import { ProjectStatus } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { isValidProjectStatus, parseTechnologies, toPublicProject } from "../lib/projects-public";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { requireActiveMember } from "../middleware/membership";
import { type AuthRequest, optionalAuth, requireAuth } from "../middleware/auth";

export const projectsRouter = Router();

const projectInclude = {
  members: {
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  },
} as const;

projectsRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const mine = req.query.mine === "1";

    if (mine && !req.user) {
      throw new ApiError(401, "Authentification requise");
    }

    const projects = await prisma.project.findMany({
      where: mine
        ? {
            members: { some: { userId: req.user!.id } },
          }
        : {
            status: { not: ProjectStatus.DRAFT },
          },
      include: projectInclude,
      orderBy: { createdAt: "desc" },
    });

    res.json({ projects: projects.map(toPublicProject) });
  }),
);

projectsRouter.post(
  "/",
  requireAuth,
  requireActiveMember,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      technologies?: string[] | string;
      githubUrl?: string;
      screenshots?: string;
      status?: string;
    };

    if (!body.title?.trim() || !body.description?.trim()) {
      throw new ApiError(400, "Titre et description sont requis");
    }

    const technologies = Array.isArray(body.technologies)
      ? body.technologies.join(",")
      : body.technologies?.trim() || "";

    if (!technologies) {
      throw new ApiError(400, "Au moins une technologie est requise");
    }

    const status =
      body.status && isValidProjectStatus(body.status) ? body.status : ProjectStatus.IN_PROGRESS;

    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        technologies,
        githubUrl: body.githubUrl?.trim() || null,
        screenshots: body.screenshots?.trim() || null,
        status,
        members: {
          create: {
            userId: req.user!.id,
            role: "lead",
          },
        },
      },
      include: projectInclude,
    });

    res.status(201).json({ project: toPublicProject(project) });
  }),
);
