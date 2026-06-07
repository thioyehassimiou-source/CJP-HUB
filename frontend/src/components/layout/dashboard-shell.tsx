import { AdminShell } from "@/components/layout/admin-shell";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { TopNav } from "@/components/layout/top-nav";

type DashboardShellProps = {
  children: React.ReactNode;
  layout?: "admin" | "catalog";
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  showFab?: boolean;
};

export function DashboardShell({
  children,
  layout = "catalog",
  sidebarTitle,
  sidebarSubtitle,
  showFab = false,
}: DashboardShellProps) {
  if (layout === "admin") {
    return <AdminShell>{children}</AdminShell>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav />
      <div className="flex">
        <AppSidebar
          variant="section"
          sectionTitle={sidebarTitle}
          sectionSubtitle={sidebarSubtitle}
        />
        <main className="flex-1 p-lg pb-24 md:ml-64 md:p-xl md:pb-xl">{children}</main>
      </div>
      {showFab ? (
        <button
          type="button"
          className="fixed bottom-lg right-lg z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-transform hover:scale-110 md:hidden"
          aria-label="Ajouter"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      ) : null}
      <MobileBottomNav />
    </div>
  );
}
