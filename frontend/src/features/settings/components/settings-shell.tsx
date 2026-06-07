import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import {
  SETTINGS_AVATAR,
  SETTINGS_HUB_FOOTER,
  SETTINGS_HUB_NAV,
  SETTINGS_MOBILE_NAV,
  SETTINGS_TOP_LINKS,
} from "@/features/settings/data/settings-data";
import { cn } from "@/lib/utils";

type SettingsShellProps = {
  children: React.ReactNode;
};

function isHubNavActive(pathname: string, href: string, activeMatch?: string) {
  const match = activeMatch ?? href;
  if (match === "/dashboard/projets") {
    return pathname.startsWith("/dashboard/projets");
  }
  if (match === "/dashboard/messages") {
    return pathname.startsWith("/dashboard/messages");
  }
  if (match === "/dashboard/parametres") {
    return pathname.startsWith("/dashboard/parametres");
  }
  return pathname === href;
}

export function SettingsShell({ children }: SettingsShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body-md text-on-background">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface shadow-sm md:flex">
        <div className="flex items-center gap-md p-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Icon name="hub" />
          </div>
          <div>
            <h1 className="text-headline-md font-bold text-primary">CJP HUB</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-md py-lg">
          {SETTINGS_HUB_NAV.map((item) => {
            const active = isHubNavActive(pathname, item.href, item.activeMatch);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-md rounded-lg px-md py-sm transition-colors",
                  active
                    ? "rounded-l-lg border-r-4 border-secondary bg-secondary-container/10 font-bold text-secondary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <Icon name={item.icon} />
                <span className="text-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant p-md">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary py-sm text-label-md text-on-primary transition-transform active:scale-95"
          >
            <Icon name="add_circle" />
            New Broadcast
          </button>
          <div className="mt-lg space-y-1">
            {SETTINGS_HUB_FOOTER.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-md rounded-lg px-md py-xs text-label-md text-on-surface-variant hover:bg-surface-container"
              >
                <Icon name={item.icon} className="text-[18px]" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-gutter backdrop-blur-md md:pl-[280px]">
        <div className="flex items-center gap-md">
          <Icon name="menu" className="text-primary md:hidden" />
          <h2 className="text-headline-md font-bold text-primary">Paramètres</h2>
        </div>

        <div className="flex items-center gap-lg">
          <div className="hidden items-center gap-xl lg:flex">
            {SETTINGS_TOP_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-md">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-low active:scale-95"
              aria-label="Rechercher"
            >
              <Icon name="search" />
            </button>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-low active:scale-95"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error" />
            </button>
            <img
              src={SETTINGS_AVATAR}
              alt=""
              className="h-8 w-8 rounded-full border border-outline-variant object-cover"
            />
          </div>
        </div>
      </header>

      <main className="min-h-screen p-margin-mobile pb-24 md:ml-64 md:p-margin-desktop md:pb-12">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-surface px-4 shadow-lg md:hidden">
        {SETTINGS_MOBILE_NAV.map((item) => {
          const active = isHubNavActive(pathname, item.href, item.activeMatch);
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
              <span className="text-[10px] font-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
