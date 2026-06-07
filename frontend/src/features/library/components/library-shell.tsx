

import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { LIBRARY_AVATAR } from "@/features/library/data/library-data";
import { LibrarySidebar } from "@/features/library/components/library-sidebar";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/lib/navigation";
import { useLocation } from "react-router-dom";

const LIBRARY_MOBILE_NAV = [
  { href: "/dashboard", label: "Accueil", icon: "dashboard" },
  { href: "/dashboard/formations", label: "Académie", icon: "school" },
  { href: "/dashboard/bibliotheque", label: "Bibliothèque", icon: "auto_stories" },
  { href: "/dashboard/admin", label: "Réglages", icon: "settings" },
];

type LibraryShellProps = {
  children: React.ReactNode;
};

export function LibraryShell({ children }: LibraryShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="overflow-hidden bg-background text-on-surface">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm">
        <div className="flex items-center gap-md">
          <Link to="/dashboard">
            <span className="text-headline-md font-bold text-primary">CJP HUB</span>
          </Link>
          <div className="hidden items-center rounded-full border border-outline-variant bg-surface-container-low px-md py-xs transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/30 md:flex">
            <Icon name="search" className="mr-xs text-on-surface-variant" />
            <input
              className="w-64 border-none bg-transparent text-body-md focus:ring-0"
              placeholder="Rechercher des ressources..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button
            type="button"
            className="cursor-pointer rounded-full p-xs transition-colors duration-200 hover:bg-surface-container-high"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full p-xs transition-colors duration-200 hover:bg-surface-container-high"
            aria-label="Aide"
          >
            <Icon name="help" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Avatar membre CJP"
            className="h-8 w-8 rounded-full border border-outline-variant object-cover"
            src={LIBRARY_AVATAR}
          />
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <LibrarySidebar />

        <main className="custom-scrollbar mx-auto max-w-[1440px] flex-1 space-y-xl overflow-y-auto p-md md:ml-64 md:p-xl">
          {children}
          <div className="h-16 md:hidden" />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-outline-variant bg-surface-container-lowest px-md py-sm md:hidden">
        {LIBRARY_MOBILE_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-xs",
                active ? "text-primary" : "text-on-surface-variant",
              )}
            >
              <Icon name={item.icon} className="text-2xl" filled={active} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
