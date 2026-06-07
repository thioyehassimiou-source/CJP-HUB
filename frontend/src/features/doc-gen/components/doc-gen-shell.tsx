

import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { DOC_GEN_AVATAR } from "@/features/doc-gen/data/attestation-data";
import { DocGenSidebar } from "@/features/doc-gen/components/doc-gen-sidebar";
import {
  DOC_GEN_TABS,
  POSTER_ADMIN_AVATAR,
  type DocGenTabId,
} from "@/features/doc-gen/data/poster-data";
import { cn } from "@/lib/utils";

type DocGenShellProps = {
  attestations: React.ReactNode;
  affiches: React.ReactNode;
  embedded?: boolean;
};

const TAB_TITLE_AFFICHES = "Concepteur d'Affiches";

function parseTab(value: string | null): DocGenTabId {
  if (value === "documents" || value === "attestations" || value === "affiches") {
    return value;
  }
  return "attestations";
}

export function DocGenShell({ attestations, affiches, embedded = false }: DocGenShellProps) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<DocGenTabId>(() =>
    parseTab(searchParams.get("tab")),
  );

  useEffect(() => {
    setActiveTab(parseTab(searchParams.get("tab")));
  }, [searchParams]);

  const isAffiches = activeTab === "affiches";

  const tabBar = (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--cjp-border)] pb-4">
      {DOC_GEN_TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
              active
                ? "bg-[var(--cjp-gold)] text-[var(--cjp-black)]"
                : "text-[var(--cjp-text-muted)] hover:text-[var(--cjp-gold)]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const tabContent = (
    <>
      {activeTab === "attestations" && attestations}
      {activeTab === "affiches" && affiches}
      {activeTab === "documents" && (
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-24 text-center">
          <Icon name="construction" className="mb-md text-5xl text-outline" />
          <h2 className="text-headline-lg text-primary">Section en préparation</h2>
          <p className="mt-sm text-body-md text-on-surface-variant">
            L&apos;onglet « Documents » sera disponible prochainement.
          </p>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <div>
        {tabBar}
        {tabContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-md shadow-sm md:px-margin-desktop">
        <div className="flex items-center gap-xl">
          {isAffiches ? (
            <span className="text-headline-md font-bold text-primary">{TAB_TITLE_AFFICHES}</span>
          ) : (
            <Link to="/dashboard">
              <span className="text-headline-md font-bold text-primary">CJP HUB</span>
            </Link>
          )}

          <div className={cn("hidden md:flex", isAffiches ? "gap-lg" : "gap-md")}>
            {DOC_GEN_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "text-body-md transition-colors",
                    isAffiches ? "rounded p-sm" : "rounded-lg px-md py-sm",
                    active
                      ? "border-b-2 border-primary font-bold text-primary"
                      : "text-on-surface-variant hover:bg-surface-container",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isAffiches ? (
          <div className="flex items-center gap-md">
            <div className="flex gap-sm">
              <button
                type="button"
                className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container"
                aria-label="Notifications"
              >
                <Icon name="notifications" />
              </button>
              <button
                type="button"
                className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container"
                aria-label="Paramètres"
              >
                <Icon name="settings" />
              </button>
            </div>
            <div className="mx-sm h-8 w-px bg-outline-variant" />
            <div className="flex items-center gap-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Profil administrateur"
                className="h-8 w-8 rounded-full bg-surface-container object-cover"
                src={POSTER_ADMIN_AVATAR}
              />
              <span className="hidden text-label-md text-on-surface lg:block">Admin CJP</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-md">
            <div className="relative hidden lg:block">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                className="rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-sm transition-all focus:border-secondary focus:outline-none"
                placeholder="Rechercher..."
                type="text"
              />
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant transition-all hover:bg-surface-container"
              aria-label="Paramètres"
            >
              <Icon name="settings" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Profil administrateur"
              className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant object-cover"
              src={DOC_GEN_AVATAR}
            />
          </div>
        )}
      </nav>

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px]">
        <DocGenSidebar />
        <section className="flex-1 overflow-y-auto bg-surface-bright p-margin-mobile md:p-margin-desktop">
          {tabContent}
        </section>
      </main>
    </div>
  );
}
