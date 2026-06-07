export const LIBRARY_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZHcbH5zk80uUf2BCZioN1JLAc9R7guYvSpx2LgVTLJ8MUXmjZtpjVNQdr7kaNJzZ9EfXA8iH54U4SaDAlTv2WXh8pAzNUwp4IfzFi6YgQfmz0myMWukPvRBLXRp5g2Lfhd9NY0D1S4jSzpkOXXuLI0V8Ka_Ekd46Ew_G62Suk1k2Yb3X7Dd-v9df_PsERsMZ-EOvFtClfg_4D0lyfCJ8wChFmrAyHij6TAjk2J9WeOki62qor-ugAgTDseSza2qnRtjPA7oCuKhY";

export const LIBRARY_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7p41Cz3y6_dA9FMK1j3NQz2HHPepB0UyJ8pBz1xPi5owxzWOEwxApC-95URid-1WP_8N26kCkYdTw-oN-OkLRaTc8XHmRFOpoUoidYK-t3OLHakTzBNvnf9fW_x3bPlY9CDrqRxgOk8qHiaZOqNc1t6wryD5pkTf2Kx6hQemmsH6aCP1gFIouExDygnxTCI_d9fnJ2sqekNFxXb_Wrh7-Frp1KbOozubNAD6Y_IXxcy4rNvtnCwTnN6V6MGdfu1DrQ1n_EDM3lcA";

export const FEATURED_GUIDE = {
  badge: "GUIDE VEDETTE",
  title: "Le manuel du développeur : de junior à senior",
  description:
    "Une feuille de route complète conçue pour les membres du CJP, couvrant les compétences techniques, les soft skills et les stratégies de networking dans l'écosystème tech moderne.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAB-TghDovS4M0_oykEAAcqBMi0bxnfu_cNE-TiTdOIgUYPaVwRsqQCyx4Cwz75j_KR0T0KPOkiwJCtrgaxUgsI-151jW06z6Ry1mb1ofOhS3r3repOIei-TBzhTPFaSKwGE1y8yoCWaTSE9K7ZV5ERMOhIaTckc4zV73CnwAhERqF2vvRCIiPJ0Zt6bnZWdPn1_8N6mZgj7MhPtXJ2-3_iDvTKQ7-nUjqYaaf9i6icGY2GocEEXpAWBMTgFWgab904iET9NPoymRE",
};

export const RESOURCE_CATEGORIES = [
  {
    id: "web",
    title: "Développement Web",
    icon: "language",
    iconClass: "text-secondary",
    bubbleClass: "bg-secondary-container/20",
    meta: "12 ressources actives • Mise à jour il y a 2 j",
    cta: "Parcourir la collection",
    ctaClass: "text-secondary",
    dark: false,
    items: [
      { icon: "picture_as_pdf", label: "React Advanced Patterns.pdf" },
      { icon: "link", label: "Maîtriser Tailwind CSS v4" },
    ],
  },
  {
    id: "mobile",
    title: "Applications Mobiles",
    icon: "smartphone",
    iconClass: "text-primary",
    bubbleClass: "bg-primary-fixed/20",
    meta: "8 ressources actives • Mise à jour il y a 1 sem.",
    cta: "Parcourir la collection",
    ctaClass: "text-primary",
    dark: false,
    items: [
      { icon: "picture_as_pdf", label: "Flutter State Management.pdf" },
      { icon: "picture_as_pdf", label: "SwiftUI Fundamentals.pdf" },
    ],
  },
  {
    id: "ai",
    title: "Intelligence Artificielle",
    icon: "psychology",
    iconClass: "text-secondary-fixed",
    meta: "15 ressources • Mise à jour aujourd'hui",
    cta: "Lancer l'académie",
    ctaClass: "text-secondary-fixed",
    dark: true,
    items: [
      { icon: "movie", label: "Intro to LLMs Workshop", badge: "Nouveau" },
      { icon: "picture_as_pdf", label: "PyTorch Basics Cheat Sheet.pdf" },
    ],
  },
];

export const ARCHIVE_DOCUMENTS = [
  {
    id: "1",
    name: "PV_Assemblee_Generale_01.pdf",
    size: "2,4 Mo • PDF",
    category: "Procès-verbal",
    date: "12 oct. 2023",
    status: "Officiel",
    statusClass: "bg-secondary-container/20 text-on-secondary-container",
    icon: "description",
    iconClass: "bg-error-container/20 text-error",
  },
  {
    id: "2",
    name: "Rapport_Activite_Annuel_2023.pdf",
    size: "12,8 Mo • PDF",
    category: "Rapport annuel",
    date: "5 janv. 2024",
    status: "Officiel",
    statusClass: "bg-secondary-container/20 text-on-secondary-container",
    icon: "article",
    iconClass: "bg-primary-fixed/20 text-primary",
  },
  {
    id: "3",
    name: "Compte_Rendu_Hackathon_v2.pdf",
    size: "5,1 Mo • PDF",
    category: "Compte-rendu événement",
    date: "28 nov. 2023",
    status: "Brouillon",
    statusClass: "bg-surface-container-high text-on-surface-variant",
    icon: "summarize",
    iconClass: "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant",
  },
];

export const ACADEMIC_YEARS = ["Année académique 2025-2026", "Année académique 2024-2025"];
