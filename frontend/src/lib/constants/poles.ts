export const POLES = [
  {
    id: "admin",
    title: "Administration & Adhésions",
    description: "Inscriptions, cartes membres, cotisations et statistiques.",
    href: "/dashboard/admin",
    phase: 2,
  },
  {
    id: "formations",
    title: "Formation & Certifications",
    description: "Cours, quiz, certificats vérifiables et portefeuille numérique.",
    href: "/dashboard/formations",
    phase: 3,
  },
  {
    id: "evenements",
    title: "Communication & Événements",
    description: "Événements, affiches, inscriptions et présence.",
    href: "/dashboard/evenements",
    phase: 3,
  },
  {
    id: "projets",
    title: "Développement & Projets",
    description: "Dépôt de projets, suivi collaboratif et portfolios.",
    href: "/dashboard/projets",
    phase: 4,
  },
  {
    id: "bibliotheque",
    title: "Bibliothèque & Mémoire",
    description: "Archives, ressources pédagogiques et rapports du club.",
    href: "/dashboard/bibliotheque",
    phase: 4,
  },
  {
    id: "tresorerie",
    title: "Trésorerie & Transparence",
    description: "Finances visibles, justificatifs et reçus numériques.",
    href: "/dashboard/tresorerie",
    phase: 2,
  },
] as const;

export type PoleId = (typeof POLES)[number]["id"];
