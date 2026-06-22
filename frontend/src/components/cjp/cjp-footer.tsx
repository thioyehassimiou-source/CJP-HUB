import { Link } from "react-router-dom";
import { CjpLogo } from "@/components/cjp/cjp-logo";

const FOOTER_LINKS = [
  { href: "/projets", label: "Portfolio des Projets" },
  { href: "/certificats/verify", label: "Vérifier un Certificat" },
  { href: "#", label: "Documentation" },
  { href: "#", label: "Contact" },
];

export function CjpFooter() {
  return (
    <footer className="border-t border-[var(--cjp-border)] bg-[var(--cjp-black)] py-12">
      <div className="cjp-container flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <CjpLogo variant="on-dark" size="md" to={null} />
          <p className="cjp-text-lead text-sm">
            © 2026 CJP HUB — Club des Jeunes Programmeurs, Université de Labé. Tous droits réservés.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:justify-end">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm text-[var(--cjp-text-muted)] transition-colors hover:text-[var(--cjp-gold)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
