import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const emailsToDelete = [
    "test.inscription@cjp.ul.edu.gn",
    "test-1780807353@example.com",
    "thioyehassimiou@gmail.com",
    "thioye1@gmail.com",
    "hasmiou.thioye@cjp.ul.edu.gn"
  ];

  await prisma.user.deleteMany({
    where: {
      email: {
        in: emailsToDelete
      }
    }
  });
  console.log("Deleted the duplicate and test users.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
