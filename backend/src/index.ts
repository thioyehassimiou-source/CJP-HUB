import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`CJP HUB API — http://localhost:${env.port}`);
});

export { prisma } from "./lib/prisma";
export * from "./lib/rbac";
export { ROLE_LABELS } from "./lib/constants/roles";
