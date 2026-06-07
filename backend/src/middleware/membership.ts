import type { NextFunction, Response } from "express";
import { MembershipStatus } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { prisma } from "../lib/prisma";
import type { AuthRequest } from "./auth";

export async function requireActiveMember(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    next(new ApiError(401, "Authentification requise"));
    return;
  }

  const membership = await prisma.membership.findUnique({
    where: { userId: req.user.id },
    select: { status: true },
  });

  if (membership?.status !== MembershipStatus.ACTIVE) {
    next(new ApiError(403, "Adhésion active requise pour cette action"));
    return;
  }

  next();
}
