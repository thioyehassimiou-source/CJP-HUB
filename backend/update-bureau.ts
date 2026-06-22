import { PrismaClient, Role, MembershipStatus } from '@prisma/client';
const prisma = new PrismaClient();

const teamMembers = [
  { email: 'fode_momo.soumah@cjp.ul.edu.gn', firstName: 'Fode Momo', lastName: 'Soumah', role: Role.ADMINISTRATEUR, title: 'Président' },
  { email: 'admin@cjp.ul.edu.gn', firstName: 'Hassimiou', lastName: 'Thioye', role: Role.ADMINISTRATEUR, title: 'Coordinateur' },
  { email: 'jean_michel.haba@cjp.ul.edu.gn', firstName: 'Jean Michel', lastName: 'Haba', role: Role.RESPONSABLE, title: "1er chargé à l'organisation" },
  { email: 'alhassane.bangoura@cjp.ul.edu.gn', firstName: 'Alhassane', lastName: 'Bangoura', role: Role.RESPONSABLE, title: "2ème chargé à l'organisation" },
  { email: 'thierno_sadou.diallo@cjp.ul.edu.gn', firstName: 'Thierno Sadou', lastName: 'Diallo', role: Role.RESPONSABLE, title: "3ème chargé à l'organisation" },
  { email: 'alhassane.niaissa@cjp.ul.edu.gn', firstName: 'Alhassane', lastName: 'Niaissa', role: Role.RESPONSABLE, title: "4ème chargé à l'organisation" },
  { email: 'moussoukoura.diawara@cjp.ul.edu.gn', firstName: 'Moussoukoura', lastName: 'Diawara', role: Role.RESPONSABLE, title: "Chargée à l'information et la communication" },
  { email: 'camara_boubacar.mangue@cjp.ul.edu.gn', firstName: 'Camara Boubacar', lastName: 'Mangué', role: Role.FORMATEUR, title: '1ère chargée aux formations' },
  { email: 'ousmane.diallo@cjp.ul.edu.gn', firstName: 'Ousmane', lastName: 'Diallo', role: Role.FORMATEUR, title: '2ème chargé aux formations' },
  { email: 'yokoi.beovogui@cjp.ul.edu.gn', firstName: 'Yokoi', lastName: 'Beovogui', role: Role.FORMATEUR, title: '3ème chargé aux formations' },
  { email: 'sagno.marcel@cjp.ul.edu.gn', firstName: 'Sagno', lastName: 'Marcel', role: Role.RESPONSABLE, title: '1ère chargée aux ressources humaines' },
  { email: 'mariama_kolenke.diallo@cjp.ul.edu.gn', firstName: 'Mariama Kolenké', lastName: 'Diallo', role: Role.RESPONSABLE, title: '2ème chargée aux ressources humaines' },
  { email: 'charlotte.haba@cjp.ul.edu.gn', firstName: 'Charlotte', lastName: 'Haba', role: Role.TRESORIER, title: 'Trésorière' },
];

async function main() {
  // Reset roles for any other member to 'MEMBRE' so they don't show up in the bureau
  await prisma.user.updateMany({
    where: {
      email: { notIn: teamMembers.map(t => t.email) },
      role: { not: Role.MEMBRE }
    },
    data: { role: Role.MEMBRE, bureauTitle: null }
  });

  for (const m of teamMembers) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {
        firstName: m.firstName,
        lastName: m.lastName,
        role: m.role,
        bureauTitle: m.title
      },
      create: {
        email: m.email,
        firstName: m.firstName,
        lastName: m.lastName,
        role: m.role,
        bureauTitle: m.title,
        membership: {
          create: {
            status: MembershipStatus.ACTIVE,
            academicYear: '2025-2026',
            validatedAt: new Date()
          }
        }
      }
    });
    console.log(`Updated/Created: ${user.firstName} ${user.lastName} - ${user.bureauTitle}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
