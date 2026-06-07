export type CjpNavItem = {
  href: string;
  label: string;
};

export const CJP_PUBLIC_NAV: CjpNavItem[] = [
  { href: "/", label: "ACCUEIL" },
  { href: "/a-propos", label: "À PROPOS" },
  { href: "/formations", label: "FORMATIONS" },
  { href: "/evenements", label: "ÉVÉNEMENTS" },
  { href: "/dashboard/projets", label: "PROJETS" },
  { href: "/tresorerie", label: "TRÉSORERIE" },
  { href: "/dashboard/bibliotheque", label: "BIBLIOTHÈQUE" },
];

export function isCjpNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/a-propos") return pathname === "/a-propos";
  if (href === "/dashboard/projets") return pathname.startsWith("/dashboard/projets");
  if (href === "/dashboard/bibliotheque") return pathname.startsWith("/dashboard/bibliotheque");
  return pathname === href || pathname.startsWith(`${href}/`);
}
