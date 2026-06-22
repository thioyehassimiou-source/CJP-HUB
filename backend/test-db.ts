import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { role: { not: "MEMBRE" } },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, bureauTitle: true }
  });
  console.log(JSON.stringify(users, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
