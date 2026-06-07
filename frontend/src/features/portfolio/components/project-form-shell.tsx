import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import {
  PROJECT_FORM_AVATAR,
  PROJECT_FORM_MOBILE_NAV,
  PROJECT_FORM_SIDEBAR_FOOTER,
  PROJECT_FORM_SIDEBAR_NAV,
  PROJECT_FORM_TOP_LINKS,
} from "@/features/portfolio/data/project-form-data";
import { cn } from "@/lib/utils";

type ProjectFormShellProps = {
  children: React.ReactNode;
};

function isNavItemActive(pathname: string, href: string, activeMatch?: string) {
  const match = activeMatch ?? href;
  if (match === "/dashboard/projets") {
    return pathname.startsWith("/dashboard/projets");
  }
  return pathname === href;
}

export function ProjectFormShell({ children }: ProjectFormShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-gutter backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-headline-md font-bold text-primary">
            CJP HUB
          </Link>
          <div className="ml-8 hidden gap-6 md:flex">
            {PROJECT_FORM_TOP_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <button
            type="button"
            className="rounded-full p-2 transition-transform hover:bg-surface-container-low active:scale-95"
            aria-label="Rechercher"
          >
            <Icon name="search" className="text-on-surface-variant" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 transition-transform hover:bg-surface-container-low active:scale-95"
            aria-label="Notifications"
          >
            <Icon name="notifications" className="text-on-surface-variant" />
          </button>
          <div className="ml-2 h-8 w-8 overflow-hidden rounded-full bg-primary-container ring-2 ring-outline-variant">
            <img src={PROJECT_FORM_AVATAR} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface pt-20 md:flex">
          <div className="flex flex-col gap-1 px-4">
            {PROJECT_FORM_SIDEBAR_NAV.map((item) => {
              const active = isNavItemActive(pathname, item.href, item.activeMatch);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3 text-body-md transition-colors",
                    active
                      ? "border-r-4 border-secondary bg-secondary-container/10 font-bold text-secondary"
                      : "text-on-surface-variant hover:bg-surface-container-high",
                  )}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto border-t border-outline-variant p-4">
            {PROJECT_FORM_SIDEBAR_FOOTER.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg p-3 text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <Icon name={item.icon} />
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <main className="flex-1 p-4 pb-32 md:ml-64 md:p-10">{children}</main>
      </div>

      <footer className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-surface px-4 md:hidden">
        {PROJECT_FORM_MOBILE_NAV.map((item) => {
          const active = isNavItemActive(pathname, item.href, item.activeMatch);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center transition-all",
                active
                  ? "rounded-full bg-secondary-container px-4 py-1 text-on-secondary-container"
                  : "text-on-surface-variant",
              )}
            >
              <Icon name={item.icon} />
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </footer>
    </div>
  );
}
