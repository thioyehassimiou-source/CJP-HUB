import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { OR: [{ firstName: { contains: "Test", mode: "insensitive" } }, { lastName: { contains: "Test", mode: "insensitive" } }] } });
  const projects = await prisma.project.findMany({ where: { title: { contains: "Test", mode: "insensitive" } } });
  const events = await prisma.event.findMany({ where: { title: { contains: "Test", mode: "insensitive" } } });
  
  console.log("Users:", users.length);
  console.log("Projects:", projects.length);
  console.log("Events:", events.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
