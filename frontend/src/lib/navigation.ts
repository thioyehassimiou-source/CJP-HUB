export type NavItem = {
  href: string;
  label: string;
  icon: string;
  mobileLabel?: string;
};

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: "dashboard", mobileLabel: "Accueil" },
  {
    href: "/dashboard/formations",
    label: "Académie",
    icon: "school",
    mobileLabel: "Académie",
  },
  { href: "/dashboard/evenements", label: "Événements", icon: "event", mobileLabel: "Événements" },
  { href: "/dashboard/tresorerie", label: "Trésorerie", icon: "payments", mobileLabel: "Finance" },
  {
    href: "/dashboard/projets",
    label: "Portfolio",
    icon: "person_book",
    mobileLabel: "Profil",
  },
  {
    href: "/dashboard/bibliotheque",
    label: "Bibliothèque",
    icon: "auto_stories",
    mobileLabel: "Bibliothèque",
  },
  { href: "/dashboard/admin", label: "Paramètres", icon: "settings" },
];

export const MOBILE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: "dashboard", mobileLabel: "Accueil" },
  {
    href: "/dashboard/formations",
    label: "Académie",
    icon: "school",
    mobileLabel: "Académie",
  },
  { href: "/dashboard/evenements", label: "Événements", icon: "event", mobileLabel: "Événements" },
  {
    href: "/dashboard/projets",
    label: "Profil",
    icon: "person_book",
    mobileLabel: "Profil",
  },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}
