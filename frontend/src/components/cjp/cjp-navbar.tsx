import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import { CJP_PUBLIC_NAV, isCjpNavActive } from "@/lib/cjp-nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth-context";

export function CjpNavbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("cjp-navbar sticky top-0 z-50", scrolled && "cjp-navbar-scrolled")}
    >
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
          {user ? (
            /* Utilisateur connecté — Profil séparé, Dashboard, Déconnexion */
            <div className="hidden sm:flex items-center gap-4">
              {/* Bouton Dashboard */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--cjp-gold)]/30 bg-[var(--cjp-gold)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)]/20 hover:border-[var(--cjp-gold)]/50"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>

              {/* Bouton Déconnexion */}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-dark)] px-3 py-1.5 text-xs font-medium text-[var(--cjp-text-muted)] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Se déconnecter
              </button>

              {/* Infos Utilisateur */}
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--cjp-border)]/50">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-[var(--cjp-white)] leading-none">
                    {user.firstName}
                  </span>
                  <span className="text-[10px] text-[var(--cjp-text-muted)] mt-0.5">
                    Membre CJP
                  </span>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cjp-gold)]/10 border border-[var(--cjp-gold)]/30 text-xs font-bold text-[var(--cjp-gold)]">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </div>
            </div>
          ) : (
            /* Utilisateur non connecté — bouton Connexion */
            <CjpButton to="/connexion" className="hidden sm:inline-flex !py-3 !text-xs">
              CONNEXION
            </CjpButton>
          )}

          {/* Hamburger mobile */}
          <button
            type="button"
            className="cjp-press rounded-lg p-2 text-[var(--cjp-white)] lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Barre de progression au scroll */}
      <div
        className="cjp-scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      {/* Menu mobile */}
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
                    "cjp-nav-link cjp-press rounded-lg px-3 py-2",
                    active && "cjp-nav-link-active bg-[var(--cjp-gray)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-4 flex flex-col gap-3 border-t border-[var(--cjp-border)] pt-4">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-[var(--cjp-gold)]/30 bg-[var(--cjp-gold)]/10 px-4 py-3.5 text-sm font-semibold text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)]/20"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cjp-gold)]/20 text-xs font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  Accéder au Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-dark)] px-4 py-3.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <CjpButton to="/connexion" className="mt-4 w-full justify-center">
                CONNEXION
              </CjpButton>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
