export const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWOb2C6D-6WZeMv5rEFHV6Bh9AkY4COpSXIjg1DLn9GoD11VCJ__iknMQaaeANhzU5egGaemjADggSurHmMo4iirvywLYvO3OczPE-kdlNDQjkHnytLVHiHwujK91rwMThdjg0Z0B9ba085aPZgGuECJ6dff6JLN3QwK-1vAMfowvngoMGp16Dgpag1RQZaCOleGyD0cc_fsr0mXuX7ZlptZ7kR5LgivE8CXX8Yh2OBzcr0Ou4kkGcgNu4nbYZjqERE7IwipTBV1E";

export const LANDING_NAV = [
  { href: "/", label: "Accueil", active: true },
  { href: "/a-propos", label: "À propos", active: false },
  { href: "/dashboard/formations", label: "Académie", active: false },
  { href: "/dashboard/evenements", label: "Événements", active: false },
  { href: "/dashboard/bibliotheque", label: "Bibliothèque", active: false },
  { href: "/dashboard/tresorerie", label: "Trésorerie", active: false },
] as const;

export const LANDING_STATS = [
  { value: "1 200+", label: "Membres actifs" },
  { value: "50+", label: "Certifications délivrées" },
  { value: "15+", label: "Événements annuels" },
] as const;

export const MISSION_PILLARS = [
  {
    icon: "school",
    title: "Apprendre",
    description:
      "Accédez à des formations de pointe alignées sur les besoins du marché international du numérique.",
    filled: true,
  },
  {
    icon: "groups",
    title: "Partager",
    description:
      "Collaborez sur des projets open-source et participez à une communauté d'entraide dynamique.",
    filled: true,
  },
  {
    icon: "emoji_events",
    title: "Exceller",
    description:
      "Démontrez votre savoir-faire lors de hackathons et obtenez des certificats reconnus.",
    filled: true,
  },
] as const;

export const POLE_CARDS = [
  {
    id: "admin",
    icon: "admin_panel_settings",
    title: "Administration",
    description: "Adhésions simplifiées et gestion de profil membre.",
    href: "/dashboard/admin",
    variant: "glass" as const,
    className: "md:col-span-4 md:row-span-1",
  },
  {
    id: "academy",
    icon: "workspace_premium",
    title: "Academy",
    description:
      "Des formations certifiantes en Web, Mobile, IA et Cybersécurité avec les meilleurs mentors du campus.",
    href: "/dashboard/formations",
    variant: "featured" as const,
    className: "md:col-span-4 md:row-span-2",
    decorIcon: "history_edu",
  },
  {
    id: "events",
    icon: "event_available",
    title: "Événements",
    description: "Hackathons, workshops et conférences tech régulières.",
    href: "/dashboard/evenements",
    variant: "glass" as const,
    className: "md:col-span-4 md:row-span-1",
  },
  {
    id: "portfolio",
    icon: "contact_page",
    title: "Portfolio",
    description: "Votre CV dynamique généré automatiquement.",
    href: "/dashboard/projets",
    variant: "outline" as const,
    className: "md:col-span-3 md:row-span-1",
  },
  {
    id: "library",
    icon: "local_library",
    title: "Bibliothèque",
    description: "Accès illimité aux ressources partagées.",
    href: "/dashboard/bibliotheque",
    variant: "outline" as const,
    className: "md:col-span-3 md:row-span-1",
  },
  {
    id: "tresorerie",
    icon: "account_balance_wallet",
    title: "Trésorerie",
    description: "Transparence financière totale.",
    href: "/dashboard/tresorerie",
    variant: "accent" as const,
    className: "md:col-span-2 md:row-span-1",
  },
] as const;

export const FOOTER_LINKS = [
  { href: "#", label: "Politique de confidentialité" },
  { href: "#", label: "Conditions d'utilisation" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Documentation" },
] as const;
