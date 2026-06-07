

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { DOC_GEN_NAV } from "@/features/doc-gen/data/attestation-data";
import { cn } from "@/lib/utils";

export function DocGenSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-64 flex-col space-y-md bg-primary-container py-lg shadow-md md:flex">
      <div className="mb-xl flex flex-col items-center px-md">
        <div className="mb-md flex h-16 w-16 items-center justify-center rounded-xl bg-white/10">
          <Icon name="school" className="text-display-lg text-white" filled />
        </div>
        <h1 className="text-headline-lg font-black text-white">CJP HUB</h1>
        <p className="text-label-md text-on-primary-container">Administration Club</p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {DOC_GEN_NAV.map((item) => {
          const isActive = item.active ?? pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-md rounded-lg px-md py-3 transition-transform hover:translate-x-1",
                isActive
                  ? "bg-secondary text-on-secondary shadow-sm"
                  : "text-on-primary-container hover:bg-on-primary-fixed-variant/10",
              )}
            >
              <Icon name={item.icon} filled={item.filled} />
              <span className="text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 px-2 pt-lg">
        <Link
          to="#"
          className="flex items-center gap-md rounded-lg px-md py-3 text-on-primary-container hover:bg-on-primary-fixed-variant/10"
        >
          <Icon name="help" />
          <span className="text-label-md">Support</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-md rounded-lg px-md py-3 text-on-primary-container hover:bg-on-primary-fixed-variant/10"
        >
          <Icon name="logout" />
          <span className="text-label-md">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
