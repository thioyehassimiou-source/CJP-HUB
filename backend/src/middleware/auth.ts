import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export type AuthRequest = Request & {
  user?: {
    id: string;
    role: Role;
  };
};

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentification requise");
    }

    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new ApiError(401, "Utilisateur introuvable");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(new ApiError(401, "Session invalide ou expirée"));
  }
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token for public reads
  }

  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ApiError(401, "Authentification requise"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "Accès refusé"));
      return;
    }
    next();
  };
}
