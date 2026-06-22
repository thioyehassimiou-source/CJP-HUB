import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const token = 'cmqmxzkpl0005ez4ibtn4pxgq';
  const link = await prisma.campaignScannerLink.findFirst({
    where: { token },
    include: { campaign: true }
  });
  console.log("Scanner Link:", link);
}
main().finally(() => prisma.$disconnect());
