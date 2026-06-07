import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import { CJP_PUBLIC_NAV, isCjpNavActive } from "@/lib/cjp-nav";
import { cn } from "@/lib/utils";

export function CjpNavbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="cjp-navbar sticky top-0 z-50">
      <div className="cjp-container flex h-[var(--cjp-nav-height)] items-center justify-between gap-4">
        <CjpLogo variant="on-dark" size="sm" showWordmark wordmarkClassName="hidden sm:inline" />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {CJP_PUBLIC_NAV.map((item) => {
            const active = isCjpNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "cjp-nav-link",
                  active && "cjp-nav-link-active",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <CjpButton to="/membres" className="hidden sm:inline-flex !py-3 !text-xs">
            ESPACE MEMBRE
          </CjpButton>
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--cjp-white)] lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {CJP_PUBLIC_NAV.map((item) => {
              const active = isCjpNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "cjp-nav-link rounded-lg px-3 py-2",
                    active && "cjp-nav-link-active bg-[var(--cjp-gray)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <CjpButton to="/membres" className="mt-4 w-full justify-center">
              ESPACE MEMBRE
            </CjpButton>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
