import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import {
  MESSAGING_AVATAR,
  MESSAGING_HUB_SIDEBAR_FOOTER,
  MESSAGING_HUB_SIDEBAR_NAV,
  MESSAGING_MOBILE_NAV,
  MESSAGING_TOP_TABS,
} from "@/features/messaging/data/messaging-data";
import { cn } from "@/lib/utils";

type MessagingShellProps = {
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
  return pathname === href;
}

export function MessagingShell({ children }: MessagingShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-body-md text-on-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-gutter backdrop-blur-md">
        <div className="flex items-center gap-md">
          <span className="text-headline-md font-extrabold text-primary">CJP HUB Messaging</span>
          <nav className="ml-xl hidden items-center gap-lg md:flex">
            {MESSAGING_TOP_TABS.map((tab) => {
              const active = tab.id === "direct" && pathname.startsWith("/dashboard/messages");
              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  className={cn(
                    "text-label-md transition-colors",
                    active
                      ? "border-b-2 border-primary pb-1 text-primary"
                      : "text-on-surface-variant hover:text-primary",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-md">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-64 rounded-lg border-none bg-surface-container-low px-md py-xs text-body-md focus:ring-2 focus:ring-secondary-container"
            />
            <Icon
              name="search"
              className="absolute top-1.5 right-2 text-on-surface-variant"
            />
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-transform hover:bg-surface-container-low active:scale-95"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <img
            src={MESSAGING_AVATAR}
            alt=""
            className="h-8 w-8 cursor-pointer rounded-full border border-outline-variant transition-transform active:scale-95"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface pt-16 md:flex">
          <div className="flex flex-col gap-sm p-md">
            <button
              type="button"
              className="mb-md flex items-center justify-center gap-sm rounded-lg bg-primary py-md text-label-md text-on-primary transition-all hover:opacity-90"
            >
              <Icon name="add" />
              New Broadcast
            </button>
            <div className="flex flex-col gap-xs">
              {MESSAGING_HUB_SIDEBAR_NAV.map((item) => {
                const active = isHubNavActive(pathname, item.href, item.activeMatch);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-md rounded-r-none px-md py-sm transition-all duration-200",
                      active
                        ? "border-r-4 border-secondary bg-secondary-container/10 font-bold text-secondary"
                        : "text-on-surface-variant hover:bg-surface-container-high",
                    )}
                  >
                    <Icon name={item.icon} />
                    <span className="text-body-md">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-xs border-t border-outline-variant p-md">
            {MESSAGING_HUB_SIDEBAR_FOOTER.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-md px-md py-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                <Icon name={item.icon} />
                <span className="text-body-md">{item.label}</span>
              </a>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 overflow-hidden bg-white md:ml-64">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-surface px-4 md:hidden">
        {MESSAGING_MOBILE_NAV.map((item) => {
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
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
