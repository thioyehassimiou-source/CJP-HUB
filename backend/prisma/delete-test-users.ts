import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["test1@cjp.ul.edu.gn", "test2@cjp.ul.edu.gn"]
      }
    }
  });
  console.log("Deleted test users");
}

main().catch(console.error).finally(() => prisma.$disconnect());
