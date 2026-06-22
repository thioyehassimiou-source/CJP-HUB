import { createServer } from "node:http";
import { createApp } from "./app";
import { env } from "./config/env";
import { initSocket } from "./lib/socket";

const app = createApp();
const server = createServer(app);

initSocket(server);

server.listen(env.port, () => {
  console.log(`CJP HUB API — http://localhost:${env.port}`);
});

export { prisma } from "./lib/prisma";
export * from "./lib/rbac";
export { ROLE_LABELS } from "./lib/constants/roles";
