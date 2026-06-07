import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ApiError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: "Erreur interne du serveur",
  });
}
