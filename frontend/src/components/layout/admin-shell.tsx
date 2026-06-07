

import { TopNav } from "@/components/layout/top-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

type AdminShellProps = {
  children: React.ReactNode;
  topNavVariant?: "embedded" | "events" | "finance";
  onNewEvent?: () => void;
};

export function AdminShell({
  children,
  topNavVariant = "embedded",
  onNewEvent,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <AppSidebar variant="admin" onNewEvent={onNewEvent} />
      <main className="min-h-screen md:ml-64">
        <TopNav variant={topNavVariant} />
        <div className="space-y-lg p-lg pb-24 md:p-xl">{children}</div>
      </main>
      {onNewEvent ? (
        <button
          type="button"
          onClick={onNewEvent}
          className="fixed bottom-lg right-lg z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-lg transition-all hover:scale-110 active:scale-95 md:hidden"
          aria-label="Nouvel événement"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
        </button>
      ) : null}
      <MobileBottomNav />
    </div>
  );
}
