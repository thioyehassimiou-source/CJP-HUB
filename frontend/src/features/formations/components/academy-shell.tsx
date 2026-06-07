import { Link, useLocation } from "react-router-dom";
import { ACADEMY_SIDEBAR_NAV } from "@/features/formations/data/course-player-data";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

function isAcademyNavActive(pathname: string, matchPrefix: string, href: string) {
  if (href === "/dashboard/formations") {
    return pathname.startsWith("/dashboard/formations");
  }
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(matchPrefix);
}

export function AcademySidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col space-y-md bg-primary-container py-lg shadow-md lg:flex">
      <div className="mb-lg px-md">
        <div className="flex items-center space-x-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Icon name="school" className="text-white" />
          </div>
          <div>
            <h1 className="text-headline-lg font-black leading-none text-on-primary-fixed">CJP HUB</h1>
            <p className="text-label-md text-on-primary-container opacity-70">Administration Club</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {ACADEMY_SIDEBAR_NAV.map((item) => {
          const active = isAcademyNavActive(pathname, item.matchPrefix, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "mx-2 my-1 flex items-center rounded-lg px-md py-sm transition-all",
                active
                  ? "bg-secondary text-on-secondary"
                  : "text-on-primary-container hover:translate-x-1 hover:bg-on-primary-fixed-variant/10",
              )}
            >
              <Icon name={item.icon} className="mr-md" />
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 px-md pt-lg">
        <Link
          to="/dashboard/admin"
          className="mb-lg block w-full rounded-lg bg-on-secondary-container py-sm text-center text-label-md text-white transition-transform active:scale-95"
        >
          Générer Doc
        </Link>
        <Link
          to="#"
          className="mx-2 flex items-center rounded-lg px-md py-sm text-on-primary-container transition-all hover:bg-on-primary-fixed-variant/10"
        >
          <Icon name="help" className="mr-md" />
          <span className="text-label-md">Support</span>
        </Link>
        <Link
          to="/"
          className="mx-2 flex items-center rounded-lg px-md py-sm text-error transition-all hover:bg-on-primary-fixed-variant/10"
        >
          <Icon name="logout" className="mr-md" />
          <span className="text-label-md">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}

export function AcademyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
      <AcademySidebar />
      <div className="relative min-h-screen lg:ml-64">{children}</div>
      <div className="pointer-events-none fixed top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-l from-primary-container/5 to-transparent" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-1/2 w-1/3 bg-gradient-to-tr from-secondary/5 to-transparent" />
    </div>
  );
}
