import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const regs = await prisma.eventRegistration.findMany({
    include: { user: true }
  });
  console.log("EVENT REGS:", JSON.stringify(regs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
