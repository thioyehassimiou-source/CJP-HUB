const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { role: { not: "MEMBRE" } },
    select: { email: true, firstName: true, lastName: true, role: true, bureauTitle: true }
  });
  console.log(users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
