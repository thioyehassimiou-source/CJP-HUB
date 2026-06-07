

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { MAIN_NAV, isNavActive } from "@/lib/navigation";
import { LIBRARY_LOGO } from "@/features/library/data/library-data";
import { cn } from "@/lib/utils";

export function LibrarySidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface-container-low px-md py-lg md:flex">
      <div className="mb-xl px-sm">
        <div className="mb-xs flex items-center gap-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Logo CJP" className="h-8 w-8 rounded-lg bg-primary" src={LIBRARY_LOGO} />
          <div>
            <div className="text-headline-md font-extrabold leading-tight text-primary">CJP HUB</div>
            <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Club des Jeunes Programmeurs
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {MAIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-md rounded-lg px-md py-sm transition-all duration-200 ease-in-out",
                active
                  ? "border-r-4 border-secondary bg-surface-container-high font-bold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-highest",
              )}
            >
              <Icon name={item.icon} />
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-md">
        <Link
          to="/dashboard/evenements"
          className="mb-md flex w-full items-center justify-center gap-sm rounded-xl bg-secondary px-md py-sm font-bold text-on-secondary transition-opacity hover:opacity-90"
        >
          <Icon name="add" />
          Nouvel événement
        </Link>
        <Link
          to="/"
          className="flex items-center gap-md rounded-lg px-md py-sm text-on-surface-variant transition-all duration-200 hover:bg-surface-container-highest"
        >
          <Icon name="logout" />
          <span className="text-label-md">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
