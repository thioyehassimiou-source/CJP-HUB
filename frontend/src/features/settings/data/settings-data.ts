export const SETTINGS_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC6n-vvWI5l0VNX3UIVJs92NzmBd8eSjpPkEEYF1ZjNL7nu_YbWwtVLVe-ubCjJs_IQ2xAbbWcbqsYizYRRGqCXPHBi2sfFXtTew_CaPVSi_MhhZ05ZuBkcBdAHhbqoHjqAIFmBzW56fH6x6xi-kT1GNBejmN9YkImVkgt7gZGko4A_t5bRkY_B2idTpRQXqf2xdjer4FWUvw24gUP4M8_CImUwbMEgOWIsZP1Qh5Op-pxsM4Hc1Fp91v1u7jEKHwBlCQf_WQv0tdA";

export const SETTINGS_PROFILE_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdU8zVyvwS1aGSAOBvOsx8fYy3df9cf1SxFmTBZEPrt_msEILHGomdVTn7KR-EB-Sg4hsf4xFu1IGNPkSKIKTpt4Gk6dtsXqcRBwAiXWRgsHRfs-uz0yjNU5bPPBr8-wDEl63o5m5S7VLJjnHKRtKMHITqnxKu7Et9gPXJK_cNECAgMCn0IFL6p_MSJyYfKgwvNEAUtXyHlkfnn9t1u4I21cmOZJvArjGoXLRsdc0qED9-Ai5zulygKyh07SMy_0W6wtiu6eybbTM";

export type HubNavItem = {
  label: string;
  icon: string;
  href: string;
  activeMatch?: string;
};

export const SETTINGS_HUB_NAV: HubNavItem[] = [
  { label: "Messages", icon: "chat", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "account_tree", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Resources", icon: "folder_shared", href: "/dashboard/bibliotheque" },
  { label: "Members", icon: "group", href: "/dashboard/projets" },
  { label: "Settings", icon: "settings", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
];

export const SETTINGS_HUB_FOOTER: HubNavItem[] = [
  { label: "Security", icon: "security", href: "#" },
  { label: "Support", icon: "help", href: "#" },
];

export const SETTINGS_TOP_LINKS = [
  { label: "Direct", href: "/dashboard/messages" },
  { label: "Groups", href: "#" },
  { label: "Announcements", href: "#" },
] as const;

export const SETTINGS_MOBILE_NAV: HubNavItem[] = [
  { label: "Chat", icon: "forum", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "inventory_2", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Docs", icon: "description", href: "/dashboard/bibliotheque" },
  { label: "Settings", icon: "settings_applications", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
];

export const SETTINGS_MEMBER = {
  name: "Alexandre Martin",
  role: "Développeur Fullstack & Lead Workshop",
  badge: "Membre Actif",
  promotion: "Promotion 2025",
  memberId: "CJP-992-XM",
  expires: "12 Sep 2024",
  email: "alexandre.martin@univ-tech.fr",
  bio: "Passionné par le développement web et l'intelligence artificielle. Lead sur le projet 'CJP Connect'.",
};

export const SETTINGS_PRIVACY = [
  { id: "publicProfile", label: "Profil Public", description: "Visible par tous les membres", defaultOn: true },
  { id: "showEmail", label: "Afficher l'email", description: "Dans l'annuaire des membres", defaultOn: false },
  { id: "activityStatus", label: "Statut d'activité", description: "Indicateur de présence", defaultOn: true },
] as const;

export const SETTINGS_NOTIFICATIONS = [
  { id: "email", label: "Email", description: "Récapitulatifs hebdomadaires et alertes", icon: "mail", defaultOn: true },
  { id: "app", label: "Application", description: "Notifications push sur mobile", icon: "smartphone", defaultOn: true },
  { id: "whatsapp", label: "WhatsApp", description: "Alertes critiques et broadcasts", icon: "chat", filled: true, defaultOn: false },
] as const;

export const SETTINGS_FIELD_CLASS =
  "w-full rounded-lg border border-outline-variant bg-surface px-md py-sm outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary";
