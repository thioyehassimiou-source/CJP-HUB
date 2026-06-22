import { Router } from "express";
import { authRouter } from "./auth.routes";
import { certificatesRouter } from "./certificates.routes";
import { eventsRouter } from "./events.routes";
import { financeRouter } from "./finance.routes";
import { formationsRouter } from "./formations.routes";
import { healthRouter } from "./health.routes";
import { messagesRouter } from "./messages.routes";
import { membersRouter } from "./members.routes";
import { projectsRouter } from "./projects.routes";
import { resourcesRouter } from "./resources.routes";
import { statsRouter } from "./stats.routes";
import { campaignsRouter } from "./campaigns.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/members", membersRouter);
apiRouter.use("/formations", formationsRouter);
apiRouter.use("/certificates", certificatesRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/finance", financeRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/resources", resourcesRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/campaigns", campaignsRouter);
