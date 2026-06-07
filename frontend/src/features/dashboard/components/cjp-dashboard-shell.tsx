import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { CjpNavbar } from "@/components/cjp/cjp-navbar";
import { useAuth } from "@/features/auth/auth-context";
import { CJP_DASHBOARD_POLES } from "@/features/dashboard/data/admin-dashboard-data";
import { cn } from "@/lib/utils";

const POLE_ICONS: Record<string, LucideIcon> = {
  Users,
  GraduationCap,
  CalendarDays,
  FolderKanban,
  Wallet,
  Library,
};

type CjpDashboardShellProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
  hideSidebar?: boolean;
  fab?: {
    onClick: () => void;
    ariaLabel: string;
  };
};

const DASHBOARD_SIDEBAR = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  ...CJP_DASHBOARD_POLES.map((pole) => ({
    href: pole.href,
    label: pole.title,
    icon: POLE_ICONS[pole.icon] ?? LayoutDashboard,
    exact: false,
  })),
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, exact: false },
  { href: "/dashboard/admin", label: "Documents", icon: FileText, exact: false },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings, exact: false },
];

function isSidebarActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CjpDashboardShell({
  children,
  fullWidth = false,
  hideSidebar = false,
  fab,
}: CjpDashboardShellProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const membershipPending = user?.membership?.status === "PENDING";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--cjp-black)] font-[family-name:var(--cjp-font-sans)] text-[var(--cjp-white)]">
      <CjpNavbar />
      {membershipPending ? (
        <div className="border-b border-[var(--cjp-gold)]/30 bg-[color-mix(in_srgb,var(--cjp-gold)_12%,var(--cjp-black))] px-4 py-3 text-center text-sm text-[var(--cjp-white)]">
          Votre adhésion est <strong className="text-[var(--cjp-gold)]">en attente de validation</strong> par le
          bureau exécutif du CJP.
        </div>
      ) : null}
      <div className="flex flex-1">
        {!hideSidebar ? (
          <aside className="hidden w-56 shrink-0 border-r border-[var(--cjp-border)] bg-[var(--cjp-dark)] lg:block xl:w-64">
            <div className="sticky top-[var(--cjp-nav-height)] max-h-[calc(100vh-var(--cjp-nav-height))] overflow-y-auto p-4">
              <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--cjp-text-muted)]">
                Administration
              </p>
              <nav className="space-y-1">
                {DASHBOARD_SIDEBAR.map((item) => {
                  const active = isSidebarActive(pathname, item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-[var(--cjp-gray)] font-semibold text-[var(--cjp-gold)]"
                          : "font-light text-[var(--cjp-text-muted)] hover:bg-[var(--cjp-gray)] hover:text-[var(--cjp-white)]",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        ) : null}

        <main
          className={cn(
            "cjp-polygon-bg flex-1 overflow-x-hidden",
            fullWidth && "flex flex-col",
          )}
        >
          {fullWidth ? (
            children
          ) : (
            <div className="cjp-container py-8 md:py-10">{children}</div>
          )}
        </main>
      </div>

      {fab ? (
        <button
          type="button"
          onClick={fab.onClick}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)] shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
          aria-label={fab.ariaLabel}
        >
          <span className="text-2xl leading-none">+</span>
        </button>
      ) : null}
    </div>
  );
}
