import {
  CotisationStatus,
  EventType,
  MembershipStatus,
  PrismaClient,
  ProjectStatus,
  Role,
  TransactionType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const memberHash = await bcrypt.hash("membre123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cjp.ul.edu.gn" },
    update: {},
    create: {
      email: "admin@cjp.ul.edu.gn",
      passwordHash: adminHash,
      firstName: "Hassimiou",
      lastName: "Thioye",
      matricule: "THHA1512131516",
      filiere: "Informatique",
      niveau: "L3",
      phone: "+224620000000",
      role: Role.ADMINISTRATEUR,
      membership: {
        create: {
          status: MembershipStatus.ACTIVE,
          memberId: "CJP-2026-0001",
          academicYear: "2025-2026",
          validatedAt: new Date(),
        },
      },
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "membre@cjp.ul.edu.gn" },
    update: {},
    create: {
      email: "membre@cjp.ul.edu.gn",
      passwordHash: memberHash,
      firstName: "Fatoumata",
      lastName: "Barry",
      matricule: "FABA2412131517",
      filiere: "Informatique",
      niveau: "L2",
      phone: "+224621111111",
      role: Role.MEMBRE,
      membership: {
        create: {
          status: MembershipStatus.ACTIVE,
          memberId: "CJP-2026-0042",
          academicYear: "2025-2026",
          validatedAt: new Date(),
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "pending@cjp.ul.edu.gn" },
    update: {},
    create: {
      email: "pending@cjp.ul.edu.gn",
      passwordHash: memberHash,
      firstName: "Mamadou",
      lastName: "Diallo",
      matricule: "DIAL2512131518",
      filiere: "Informatique",
      niveau: "L1",
      phone: "+224622222222",
      role: Role.MEMBRE,
      membership: {
        create: {
          status: MembershipStatus.PENDING,
          academicYear: "2025-2026",
        },
      },
    },
  });

  await prisma.certificate.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.event.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.transaction.deleteMany({ where: { createdById: admin.id } });
  await prisma.cotisation.deleteMany({ where: { userId: member.id } });

  await prisma.formation.createMany({
    data: [
      {
        title: "React & TypeScript avancé",
        description: "Hooks, patterns et architecture frontend moderne.",
        level: "Intermédiaire",
        program: "Web",
        published: true,
      },
      {
        title: "Cybersécurité appliquée",
        description: "OWASP, tests d'intrusion et bonnes pratiques.",
        level: "Avancé",
        program: "Sécurité",
        published: true,
      },
      {
        title: "Python & Data Science",
        description: "Analyse de données et visualisation pour projets étudiants.",
        level: "Intermédiaire",
        program: "Data",
        published: true,
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Forum Développement Web & Réseaux",
        description: "Conférence annuelle du CJP — IA et cybersécurité.",
        type: EventType.CONFERENCE,
        speaker: "Bureau exécutif CJP",
        startAt: new Date("2026-09-15T09:00:00"),
        endAt: new Date("2026-09-15T17:00:00"),
        location: "Amphithéâtre principal — Université de Labé",
        maxPlaces: 300,
        posterUrl: "/brand/events/cjp-forum-web.jpg",
        published: true,
      },
      {
        title: "Atelier Git & GitHub",
        description: "Prise en main du versioning collaboratif.",
        type: EventType.FORMATION,
        speaker: "Équipe technique CJP",
        startAt: new Date("2026-07-02T14:00:00"),
        endAt: new Date("2026-07-02T17:00:00"),
        location: "Salle labo CJP",
        maxPlaces: 40,
        posterUrl: "/brand/events/cjp-digitalis.jpg",
        published: true,
      },
      {
        title: "Hackathon CJP 2026",
        description:
          "48 heures pour concevoir des solutions numériques à fort impact social pour l'Université de Labé.",
        type: EventType.HACKATHON,
        speaker: "Bureau exécutif CJP",
        startAt: new Date("2026-03-15T08:00:00"),
        endAt: new Date("2026-03-17T18:00:00"),
        location: "Campus Université de Labé",
        maxPlaces: 120,
        posterUrl: "/brand/events/cjp-forum-audience.jpg",
        published: true,
      },
    ],
  });

  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.INCOME,
        amount: 2500000,
        category: "Cotisations",
        description: "Cotisations membres — trimestre 1",
        createdById: admin.id,
        transactionAt: new Date("2026-01-15"),
      },
      {
        type: TransactionType.INCOME,
        amount: 1500000,
        category: "Partenariat",
        description: "Sponsoring DIGITALIS",
        createdById: admin.id,
        transactionAt: new Date("2026-02-01"),
      },
      {
        type: TransactionType.EXPENSE,
        amount: 800000,
        category: "Équipement",
        description: "Achat matériel atelier",
        createdById: admin.id,
        transactionAt: new Date("2026-02-10"),
      },
    ],
  });

  await prisma.cotisation.create({
    data: {
      userId: member.id,
      amount: 50000,
      status: CotisationStatus.PAID,
      paidAt: new Date(),
      receiptNo: "CJP-RCP-2026-0042",
      academicYear: "2025-2026",
    },
  });

  await prisma.project.create({
    data: {
      title: "CJP Event Manager",
      description:
        "Module de gestion des inscriptions aux événements, présences et certificats pour le club.",
      technologies: "React,TypeScript,Node.js,PostgreSQL",
      githubUrl: "https://github.com/cjp-ul/event-manager",
      status: ProjectStatus.IN_PROGRESS,
      members: {
        create: [
          { userId: admin.id, role: "lead" },
          { userId: member.id, role: "contributor" },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Portail Cotisations CJP",
      description: "Interface de suivi des cotisations et transparence financière du bureau.",
      technologies: "React,Express,Prisma",
      githubUrl: "https://github.com/cjp-ul/cotisations",
      status: ProjectStatus.COMPLETED,
      members: {
        create: [{ userId: member.id, role: "lead" }],
      },
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        title: "React Advanced Patterns",
        description: "Patterns avancés pour applications React modernes.",
        category: "Web",
        externalUrl: "https://react.dev/learn",
        uploadedById: admin.id,
      },
      {
        title: "Guide Tailwind CSS v4",
        description: "Migration et bonnes pratiques Tailwind v4.",
        category: "Web",
        externalUrl: "https://tailwindcss.com/docs",
        uploadedById: admin.id,
      },
      {
        title: "Intro aux LLM — Workshop",
        description: "Support de l'atelier intelligence artificielle CJP.",
        category: "IA",
        externalUrl: "https://univ-labe.edu.gn",
        uploadedById: admin.id,
      },
      {
        title: "PV Assemblée Générale 2025",
        description: "Procès-verbal officiel du bureau exécutif.",
        category: "Administration",
        fileUrl: "/brand/events/cjp-forum-audience.jpg",
        uploadedById: admin.id,
      },
    ],
  });

  console.log("Seed terminé.");
  console.log("Admin:", admin.email, "/ admin123");
  console.log("Membre:", member.email, "/ membre123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
