import { Link } from "react-router-dom";
import { ABOUT_NAV } from "@/features/about/data/about-data";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function AboutHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="landing-container flex h-16 items-center justify-between">
        <Link to="/" className="text-headline-md font-black text-primary">
          CJP HUB
        </Link>

        <nav className="hidden h-full items-center gap-xl md:flex">
          {ABOUT_NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-body-md transition-colors",
                item.active
                  ? "border-b-2 border-primary pb-1 font-bold text-primary"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-md">
          <Link
            to="/inscription"
            className="rounded-lg bg-primary-container px-lg py-sm text-label-md text-on-primary-container transition-opacity hover:opacity-80"
          >
            Rejoindre le club
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AboutSectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="border-l-4 border-secondary pl-md text-headline-lg text-primary-container">
        {children}
      </h2>
      {subtitle ? <p className="mt-sm text-body-md text-on-surface-variant">{subtitle}</p> : null}
    </div>
  );
}

export function AboutFooter() {
  return (
    <footer className="w-full border-t border-outline-variant bg-primary-container">
      <div className="landing-container flex flex-col items-center justify-between gap-md py-lg md:flex-row">
        <div className="flex flex-col items-center gap-xs md:items-start">
          <div className="text-headline-md font-bold text-on-primary-container">CJP HUB</div>
          <p className="text-label-md text-on-primary-container/70">
            © 2026 Club des Jeunes Programmeurs (CJP) — Université de Labé. Tous droits réservés.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-lg">
          {[
            "Politique de confidentialité",
            "Code de conduite",
            "Contact",
            "Ressources",
          ].map((label) => (
            <Link
              key={label}
              to="#"
              className="text-label-md text-on-primary-container transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex gap-md">
          <Link
            to="#"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-on-primary-container text-on-primary-container transition-all hover:bg-on-primary-container hover:text-primary-container"
          >
            <Icon name="alternate_email" />
          </Link>
          <Link
            to="#"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-on-primary-container text-on-primary-container transition-all hover:bg-on-primary-container hover:text-primary-container"
          >
            <Icon name="terminal" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
