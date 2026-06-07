

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { MAIN_NAV, isNavActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function PortfolioSidebar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface-container-low px-md py-lg md:flex">
      <div className="mb-xl px-sm">
        <div className="mb-xs flex items-center gap-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Icon name="terminal" className="text-on-primary" />
          </div>
          <div>
            <h2 className="text-headline-md font-extrabold leading-tight text-primary">CJP HUB</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Club des Jeunes Programmeurs
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-xs">
        {MAIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-md rounded-lg px-md py-sm transition-all duration-200",
                active
                  ? "border-r-4 border-secondary bg-surface-container-highest font-bold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-highest",
              )}
            >
              <Icon name={item.icon} />
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-outline-variant pt-lg">
        <Link
          to="/"
          className="flex w-full items-center gap-md rounded-lg px-md py-sm text-on-surface-variant transition-all duration-200 hover:bg-surface-container-highest"
        >
          <Icon name="logout" />
          <span className="text-label-md">Déconnexion</span>
        </Link>
      </div>
    </nav>
  );
}
