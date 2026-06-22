import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update Hassimiou
  await prisma.user.update({
    where: { email: 'admin@cjp.ul.edu.gn' },
    data: { bureauTitle: 'Coordinateur' }
  });

  // Update Fatoumata
  await prisma.user.update({
    where: { email: 'membre@cjp.ul.edu.gn' },
    data: { role: 'MEMBRE' }
  });

  console.log('Database updated.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
