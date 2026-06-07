export const PROJECT_FORM_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIkcDNX5AEas2h9IMsll0LQLkB8phWTYnZ2UrNiMy8PjGe0r3MKIhUQ9mmdyYyWkjdnnNm4FmJSf9pkJ5QiagTYtaiuJuKGpX0mZoxH1eGlLjbqNcp9iElHAO38po0YAXeEuGjiu9d6j4x6tRBOVj2cLjuD2pXz8uYg4CE80QQjNLIEpYF74XwgfWqnGBbm4PGQodg88zZUr66-AXuE3Pm3S4pKet3t2bH0EH1eivwt5J-RqysqWZRN258SlUpX2P9fyj3aC19C0o";

export const PROJECT_TECH_OPTIONS = [
  "React",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "TypeScript",
  "PostgreSQL",
  "Docker",
] as const;

export const PROJECT_FORM_TOP_LINKS = [
  { label: "Direct", href: "#" },
  { label: "Groups", href: "#" },
  { label: "Announcements", href: "#" },
] as const;

export type ProjectFormNavItem = {
  label: string;
  icon: string;
  href: string;
  activeMatch?: string;
};

export const PROJECT_FORM_SIDEBAR_NAV: ProjectFormNavItem[] = [
  { label: "Messages", icon: "chat", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "account_tree", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Resources", icon: "folder_shared", href: "/dashboard/bibliotheque" },
  { label: "Members", icon: "group", href: "/dashboard/projets" },
  { label: "Settings", icon: "settings", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
] ;

export const PROJECT_FORM_SIDEBAR_FOOTER: ProjectFormNavItem[] = [
  { label: "Security", icon: "security", href: "#" },
  { label: "Support", icon: "help", href: "#" },
] ;

export const PROJECT_FORM_MOBILE_NAV: ProjectFormNavItem[] = [
  { label: "Chat", icon: "forum", href: "/dashboard/messages", activeMatch: "/dashboard/messages" },
  { label: "Projects", icon: "inventory_2", href: "/dashboard/projets/nouveau", activeMatch: "/dashboard/projets" },
  { label: "Docs", icon: "description", href: "/dashboard/bibliotheque" },
  { label: "Settings", icon: "settings_applications", href: "/dashboard/parametres", activeMatch: "/dashboard/parametres" },
] ;

export const PROJECT_FORM_FIELD_CLASS =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md outline-none transition-all focus:border-secondary focus:ring-1 focus:ring-secondary";

export const PROJECT_FORM_LABEL_CLASS = "mb-2 block text-label-md text-on-surface-variant";
