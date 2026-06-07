

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { MAIN_NAV, isNavActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  variant?: "admin" | "section";
  sectionTitle?: string;
  sectionSubtitle?: string;
  onNewEvent?: () => void;
};

export function AppSidebar({
  variant = "section",
  sectionTitle = "Académie",
  sectionSubtitle = "Catalogue de formations",
  onNewEvent,
}: AppSidebarProps) {
  const { pathname } = useLocation();
  const isAdmin = variant === "admin";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low px-md py-lg md:flex",
        !isAdmin && "pt-20",
      )}
    >
      <div className="mb-xl px-sm">
        {isAdmin ? (
          <>
            <h1 className="text-headline-md font-extrabold text-primary">CJP HUB</h1>
            <p className="text-label-md text-on-surface-variant">Club des Jeunes Programmeurs</p>
          </>
        ) : (
          <>
            <h2 className="text-headline-md font-extrabold leading-tight text-primary">
              {sectionTitle}
            </h2>
            <p className="text-label-md text-on-surface-variant">{sectionSubtitle}</p>
          </>
        )}
      </div>

      <nav className={cn("flex flex-1 flex-col", isAdmin ? "gap-base space-y-base" : "gap-xs")}>
        {MAIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-md p-md transition-all duration-200 ease-in-out",
                isAdmin ? "rounded" : "rounded-lg",
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
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-lg">
        {isAdmin &&
          (onNewEvent ? (
            <button
              type="button"
              onClick={onNewEvent}
              className="mb-lg flex w-full items-center justify-center gap-sm rounded-lg bg-secondary px-md py-sm text-label-md text-on-secondary transition-opacity hover:opacity-90"
            >
              <Icon name="add" className="text-[18px]" />
              Nouvel événement
            </button>
          ) : (
            <Link
              to="/dashboard/evenements"
              className="mb-lg flex w-full items-center justify-center gap-sm rounded-lg bg-secondary px-lg py-md text-label-md text-on-secondary transition-all hover:brightness-110"
            >
              <Icon name="add_circle" filled />
              Nouvel événement
            </Link>
          ))}
        <Link
          to="/"
          className="flex items-center gap-md rounded-lg p-md text-on-surface-variant transition-all duration-200 hover:bg-surface-container-highest"
        >
          <Icon name="logout" />
          <span className="text-label-md">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
