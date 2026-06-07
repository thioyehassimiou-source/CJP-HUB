import { Icon } from "@/components/ui/icon";
import { ADMIN_AVATAR } from "@/features/dashboard/data/admin-dashboard-data";
import { FINANCE_AVATAR } from "@/features/finance/data/finance-data";

export const EVENTS_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDhZVA9G8jc6wAuMbENRTTeRi7CSPZzJU_QwCJrrs-2ZKlp5J9gdTaziwxPQ5hTMUdmstBPzO8MxNAh_57NNpIJrGNjebqg4otvaseGjl15WbvH41nog6bb_6UR79z1lMBTZayd-sWgRUMqlV5VPb4xr4b5AFK1HKb4tbxDS8dVHWAf9Hd1sY66yIy5wMCA4opJsMRrt1avSqA7TZuylSAPqlhkCVyivk_diaOyzGJNuQZWzhagiNL_5tu5X5TOPbXCPNqA00Z4RFI";

type TopNavProps = {
  variant?: "catalog" | "embedded" | "events" | "finance";
  searchPlaceholder?: string;
};

export function TopNav({
  variant = "catalog",
  searchPlaceholder = "Rechercher dans le catalogue...",
}: TopNavProps) {
  if (variant === "finance") {
    return (
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm">
        <div className="flex items-center gap-md">
          <h2 className="text-headline-md font-bold text-primary">Centre financier</h2>
        </div>

        <div className="flex items-center gap-lg">
          <div className="relative hidden transition-transform focus-within:scale-[1.02] sm:block">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              className="w-64 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-body-md transition-all focus:ring-2 focus:ring-secondary-fixed"
              placeholder="Rechercher des transactions..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-md">
            <button
              type="button"
              className="text-on-surface-variant transition-colors hover:text-primary"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              className="text-on-surface-variant transition-colors hover:text-primary"
              aria-label="Aide"
            >
              <Icon name="help" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Avatar membre CJP"
              className="h-8 w-8 rounded-full border border-outline-variant object-cover"
              src={FINANCE_AVATAR}
            />
          </div>
        </div>
      </header>
    );
  }

  if (variant === "events") {
    return (
      <header className="sticky top-0 z-50 ml-0 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="flex items-center gap-md">
          <div className="relative hidden md:block">
            <Icon
              name="search"
              className="absolute left-sm top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              className="w-64 rounded-full border-none bg-surface-container-low py-xs pl-xl pr-md text-body-md focus:ring-2 focus:ring-secondary"
              placeholder="Rechercher des événements..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-lg">
          <div className="flex gap-md">
            <button
              type="button"
              className="rounded-full p-xs transition-colors hover:bg-surface-container-high"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              className="rounded-full p-xs transition-colors hover:bg-surface-container-high"
              aria-label="Aide"
            >
              <Icon name="help" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Avatar membre CJP"
            className="h-8 w-8 rounded-full border border-outline-variant object-cover"
            src={EVENTS_AVATAR}
          />
        </div>
      </header>
    );
  }

  const avatarUrl = variant === "embedded" ? ADMIN_AVATAR : undefined;

  if (variant === "embedded") {
    return (
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm">
        <div className="flex items-center gap-lg">
          <button type="button" className="text-primary md:hidden" aria-label="Menu">
            <Icon name="menu" />
          </button>
          <div className="relative hidden w-64 md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-sm text-outline">
              <Icon name="search" />
            </span>
            <input
              className="w-full rounded-lg border-none bg-surface-container-low py-xs pl-xl text-body-md focus:ring-2 focus:ring-secondary"
              placeholder="Rechercher des ressources..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button
            type="button"
            className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Aide"
          >
            <Icon name="help" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-primary-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Avatar administrateur" className="h-full w-full object-cover" src={avatarUrl} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg shadow-sm">
      <div className="flex items-center gap-md">
        <h1 className="text-headline-md font-bold text-primary">CJP HUB</h1>
        <div className="ml-lg hidden items-center gap-sm rounded-lg bg-surface-container-high px-md py-xs md:flex">
          <Icon name="search" className="text-on-surface-variant" />
          <input
            className="w-64 border-none bg-transparent text-body-md focus:ring-0"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-md">
        <button
          type="button"
          className="rounded-full p-sm transition-colors hover:bg-surface-container-high"
          aria-label="Notifications"
        >
          <Icon name="notifications" className="text-on-surface-variant" />
        </button>
        <button
          type="button"
          className="rounded-full p-sm transition-colors hover:bg-surface-container-high"
          aria-label="Aide"
        >
          <Icon name="help" className="text-on-surface-variant" />
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-secondary-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Avatar membre CJP"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0rTjtQt9-vWi3ZbjjHg9gAfex5myZklHXpBSYByED4GJQXDUNKr_iX9TnLx3B3BVGntHxrgo0AZ87ll3LTfVkjjoJP68BxWVzhbVMwFKKbhGetbKB2W5z0JgQdHoch8EdjZbHtwpTq9n3HNR5KIUixrH-Mkwwx9p3eSRpAjoufOH5CKYgJbQvyJX_EKAUNdmHrVoawKc1NtIWlGEjjno_S4A9yllX7_B_YxEp3-t7mZX6RmMtFPBFM7Fd5Tph2eUh-umSgyD1esY"
          />
        </div>
      </div>
    </header>
  );
}
