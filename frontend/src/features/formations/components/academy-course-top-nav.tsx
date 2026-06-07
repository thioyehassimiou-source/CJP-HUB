import { Link } from "react-router-dom";
import { ACADEMY_TOP_AVATAR } from "@/features/formations/data/course-player-data";
import { Icon } from "@/components/ui/icon";

export function AcademyCourseTopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-mobile shadow-sm md:px-margin-desktop">
      <div className="flex items-center space-x-lg">
        <div className="flex items-center rounded-full bg-surface-container px-md py-xs">
          <Icon name="search" className="mr-sm text-outline" />
          <input
            className="w-40 border-none bg-transparent text-body-md focus:ring-0 sm:w-64"
            placeholder="Rechercher une formation..."
            type="text"
          />
        </div>
        <nav className="hidden h-16 items-center space-x-md md:flex">
          <Link
            to="/dashboard/admin"
            className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >
            Documents
          </Link>
          <Link
            to="/dashboard/admin"
            className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >
            Attestations
          </Link>
          <Link
            to="/dashboard/admin?tab=affiches"
            className="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >
            Affiches
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-md">
        <Link
          to="/dashboard/projets/nouveau"
          className="hidden rounded-lg bg-primary px-md py-sm text-label-md text-white transition-all hover:opacity-90 active:scale-95 sm:block"
        >
          Nouveau Projet
        </Link>
        <div className="flex items-center space-x-sm">
          <button
            type="button"
            className="rounded-full p-sm hover:bg-surface-container"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="rounded-full p-sm hover:bg-surface-container"
            aria-label="Paramètres"
          >
            <Icon name="settings" />
          </button>
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-outline-variant">
          <img src={ACADEMY_TOP_AVATAR} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  );
}
