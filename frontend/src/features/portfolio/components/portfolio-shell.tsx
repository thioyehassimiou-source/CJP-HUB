import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PortfolioSidebar } from "@/features/portfolio/components/portfolio-sidebar";
import { PORTFOLIO_AVATAR } from "@/features/portfolio/data/portfolio-data";

type PortfolioShellProps = {
  children: React.ReactNode;
};

export function PortfolioShell({ children }: PortfolioShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm">
        <div className="flex items-center gap-md">
          <Link to="/dashboard">
            <span className="text-headline-md font-bold text-primary">CJP HUB</span>
          </Link>
          <div className="hidden items-center rounded-full border border-outline-variant bg-surface-container-low px-md py-xs md:flex">
            <Icon name="search" className="mr-xs text-on-surface-variant" />
            <input
              className="w-64 border-none bg-transparent text-body-md focus:ring-0"
              placeholder="Rechercher des ressources..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button
            type="button"
            className="cursor-pointer rounded-full p-sm transition-colors duration-200 hover:bg-surface-container-high"
            aria-label="Notifications"
          >
            <Icon name="notifications" className="text-on-surface-variant" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full p-sm transition-colors duration-200 hover:bg-surface-container-high"
            aria-label="Aide"
          >
            <Icon name="help" className="text-on-surface-variant" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Avatar membre CJP"
            className="h-10 w-10 rounded-full border border-outline-variant object-cover"
            src={PORTFOLIO_AVATAR}
          />
        </div>
      </header>

      <PortfolioSidebar />

      <main className="min-h-screen bg-background p-lg pb-24 md:ml-64">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
