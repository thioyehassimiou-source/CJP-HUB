import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));

  app.get("/", (_req, res) => {
    res.json({
      name: "CJP HUB API",
      version: "0.1.0",
      docs: "/api/health",
    });
  });

  app.use("/api", apiRouter);

  app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    errorHandler(error, req, res, next);
  });

  return app;
}
