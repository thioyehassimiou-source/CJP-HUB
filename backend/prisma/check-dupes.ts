import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { lastName: { contains: "Thioye", mode: "insensitive" } },
        { firstName: { contains: "Test", mode: "insensitive" } },
        { lastName: { contains: "Test", mode: "insensitive" } },
        { firstName: { contains: "inscription", mode: "insensitive" } },
        { lastName: { contains: "inscription", mode: "insensitive" } },
      ]
    },
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  console.log("REMAINING DUPES/TESTS:", JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
