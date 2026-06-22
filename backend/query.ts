import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const campaigns = await prisma.certificateCampaign.findMany();
  console.log("Campaigns:", campaigns);
}
main().finally(() => prisma.$disconnect());
