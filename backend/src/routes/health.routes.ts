import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      service: "cjp-hub-api",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  }),
);
