export const HOME_STATS = [
  { value: "120+", label: "Membres actifs" },
  { value: "24", label: "Formations" },
  { value: "50+", label: "Certifications" },
  { value: "18", label: "Projets" },
] as const;

export const HOME_POLES = [
  {
    id: "membres",
    title: "Membres",
    description: "Gestion des adhésions, profils et statuts étudiants.",
    href: "/membres",
  },
  {
    id: "formations",
    title: "Formations",
    description: "Parcours certifiants Web, Mobile, IA et Cybersécurité.",
    href: "/formations",
  },
  {
    id: "evenements",
    title: "Événements",
    description: "Hackathons, workshops et conférences tech du campus.",
    href: "/evenements",
  },
  {
    id: "projets",
    title: "Projets",
    description: "Portfolio collaboratif et suivi des réalisations.",
    href: "/dashboard/projets",
  },
  {
    id: "tresorerie",
    title: "Trésorerie",
    description: "Transparence financière et cotisations numériques.",
    href: "/tresorerie",
  },
  {
    id: "bibliotheque",
    title: "Bibliothèque",
    description: "Ressources partagées et archives du club.",
    href: "/dashboard/bibliotheque",
  },
] as const;

export const PUBLIC_FORMATIONS = [
  {
    id: "react",
    title: "React & Next.js Avancé",
    instructor: "Dr. Mamadou Barry",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD79K90zCQKai87r98pCgqyzFGqXzaE3EUCLCtC1qXoSfbEhQDp8RDrVGO_nMjLWbg-LbuowoslfchJ-y3cOU_PxqnbgitwmaeDPWoHYw2_ImVwegXSPjPBgEjzZUrQHH047s9vWTBzfhV09MAEi0BoDIIc8dJKEOGhXcpvL-geYmW6-RjZw9GgdzJjXswml4guyhImF8h2KY_xx7W6s0AkhkvgpfsHLufQ6FC2Hg0g2FDG3TLTXfxDWDuAe6EMzjrNbQIjCmn3Jcg",
    lieu: "Labo CJP — Campus",
    heure: "14h00 — 17h00",
    places: "24 places",
  },
  {
    id: "cyber",
    title: "Cybersécurité Appliquée",
    instructor: "Aissatou Camara",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnCQKHdM6ruqb_xwSLa409hBjO-3sJyFLraK6oT7syl_PnCahy4y07e6MOJhFjv7VqddrSwuKwUIVdh8vk2dIqokUwVJoh_g_hR_fMwqwRAxtHY-EcbiJoukoBkHK5q9HPCHBYcGw6u5pkgTFCF1QPUQ3IfHnUssoOC1i3TyiwafNq_xGWuk_GpTuJsEDWR0DjP4sSIrUif0iVTWQrcI4ccPZWqZOkjqKd1ty0y3Okmh58zUwUBW0pT0OP48GM0tvpPYZnpQPz3A",
    lieu: "Amphi B — Faculté",
    heure: "09h00 — 12h00",
    places: "30 places",
  },
  {
    id: "python",
    title: "Python Data Science",
    instructor: "Ibrahima Diallo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuJ2vPH2gFCTwKzO03sL6EouPT-FkAxULeACqOCl28947eULQpmqI6bcLbcXqCste8Gsm_Ys99q8EZfBIP2WxzbKjz_pKDa6EtVx9arHiJd658SFHUr97Z4bp3RwG5jlArAH9rzCukmTOXDYKG0S3brzDpnwxJwOKmXsxmYLmdCFaH7EjR27E7Uz-cusmyNPx6ETz774eRPAs_2pfxxRNiTC11qkAr26jA4myNXH2PyhnUjOGPoqtrRuDzNPgp_3zUd0j_NU8Inq0",
    lieu: "Salle Info 3",
    heure: "10h00 — 13h00",
    places: "20 places",
  },
] as const;

export const PUBLIC_EVENTS = [
  {
    id: "hackathon-2026",
    title: "Hackathon CJP 2026",
    description:
      "48 heures pour concevoir des solutions numériques à fort impact social pour l'Université de Labé.",
    date: "15 Mars 2026",
    published: "Publié le 2 Fév 2026",
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDn4KjGE-Eor8r2xZfP-qBN9aKMU7Lj18wgb68Jv9PFtFud-YVPm7xz9ee1Q2e7siXHltu_Wm1f-vdykegbgVzR0pQu-2G8IpCKKaBYtj0hoNyJ3vTlIVVeFJkn5SPoNc431QytWMLJbgnNxKrPwM4TZD_gRwKMjR3OPujwzFX1S1iKpftbaItL_sv69rx9B3raVL5iMzPe5y2MZ3Pk-2DmF78iOUlpUd0rR_7scbhOIcRgsL8hNKUyfnKeUDyo0xj6R0lQ6Ccb5SE",
  },
  {
    id: "workshop-ia",
    title: "Workshop Intelligence Artificielle",
    description:
      "Initiation pratique aux modèles de langage et à l'automatisation de workflows étudiants.",
    date: "28 Fév 2026",
    published: "Publié le 10 Jan 2026",
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmz5TMnjhQxLQGQDalRNGEhHFrnM6LRmcPEjee9EPW0CdE05xyHhLRcmlyTdl32Ud5tSeJxuNppfaOvBZTFNaxZPcWcLwsasredlpUizHssw4O59Tg7-QJEStQ5YzUzib4OmBZ0ydqqGhrjNQyCmTIx6TE8XkEXL7VoyWFN0kwlmwRgCqQUY4HAOkcnvK_wqE0U3RdxE7MZ5rlBnVvglGHN-WhPrTkHWJhQ2dKF4ag3lK8NiyAU-0Jk3IsAqb0fRxROKGs52WTq-c",
  },
] as const;

export const PUBLIC_MEMBERS = [
  {
    id: "1",
    name: "Hassimiou Thioye",
    filiere: "Informatique",
    niveau: "L3",
    status: "actif" as const,
    initials: "HT",
  },
  {
    id: "2",
    name: "Aissatou Camara",
    filiere: "MIAGE",
    niveau: "L2",
    status: "actif" as const,
    initials: "AC",
  },
  {
    id: "3",
    name: "Ibrahima Diallo",
    filiere: "Mathématiques",
    niveau: "L2",
    status: "inactif" as const,
    initials: "ID",
  },
  {
    id: "4",
    name: "Mariama Bah",
    filiere: "Informatique",
    niveau: "L3",
    status: "actif" as const,
    initials: "MB",
  },
  {
    id: "5",
    name: "Alpha Condé",
    filiere: "Informatique",
    niveau: "L3",
    status: "actif" as const,
    initials: "AC",
  },
  {
    id: "6",
    name: "Fatoumata Sylla",
    filiere: "Informatique",
    niveau: "L1",
    status: "inactif" as const,
    initials: "FS",
  },
] as const;

export const PUBLIC_TREASURY = {
  income: "28 400 000 GNF",
  expenses: "14 149 400 GNF",
  balance: "14 250 600 GNF",
  chart: [
    { month: "Oct", income: 4200, expenses: 2100 },
    { month: "Nov", income: 5100, expenses: 2800 },
    { month: "Déc", income: 4800, expenses: 2400 },
    { month: "Jan", income: 6200, expenses: 3100 },
    { month: "Fév", income: 5800, expenses: 2900 },
  ],
  transactions: [
    { id: "1", date: "24 oct. 2025", label: "Hébergement cloud AWS", amount: "- 150 000 GNF", category: "Infrastructure" },
    { id: "2", date: "22 oct. 2025", label: "Cotisation — Sarah Chen", amount: "+ 50 000 GNF", category: "Cotisations" },
    { id: "3", date: "18 oct. 2025", label: "Restauration atelier #12", amount: "- 82 400 GNF", category: "Événements" },
    { id: "4", date: "15 oct. 2025", label: "Sponsoring Tech Corp", amount: "+ 2 000 000 GNF", category: "Partenariat" },
    { id: "5", date: "10 oct. 2025", label: "Renouvellement domaine", amount: "- 25 000 GNF", category: "Infrastructure" },
  ],
} as const;

import { UNIVERSITE_LABE_FILIERES, UNIVERSITE_LABE_NIVEAUX } from "@/lib/university-rules";

export const FILIERES = ["Toutes", ...UNIVERSITE_LABE_FILIERES] as const;
export const NIVEAUX = ["Tous", ...UNIVERSITE_LABE_NIVEAUX] as const;
