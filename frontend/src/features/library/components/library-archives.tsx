

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  ACADEMIC_YEARS,
  ARCHIVE_DOCUMENTS,
  FEATURED_GUIDE,
  RESOURCE_CATEGORIES,
} from "@/features/library/data/library-data";
import { cn } from "@/lib/utils";

function ResourceCategoryCard({
  category,
}: {
  category: (typeof RESOURCE_CATEGORIES)[number];
}) {
  if (category.dark) {
    return (
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-lg transition-shadow hover:-translate-y-0.5 hover:shadow-xl md:col-span-4 lg:col-span-2">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div>
          <Icon name={category.icon} className="mb-md text-[40px] text-secondary-fixed" filled />
          <h3 className="text-headline-md text-white">{category.title}</h3>
          <p className="mt-xs text-body-md text-on-primary-container">{category.meta}</p>
        </div>
        <div className="mt-xl space-y-sm">
          {category.items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-white/10 p-sm text-label-md font-bold text-white hover:bg-white/20"
            >
              <div className="flex items-center gap-sm">
                <Icon name={item.icon} className="text-[18px]" />
                <span>{item.label}</span>
              </div>
              {"badge" in item && item.badge ? (
                <span className="rounded bg-secondary px-xs py-[2px] text-[10px] uppercase text-on-secondary">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={cn(
            "mt-lg flex items-center gap-xs text-label-md font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1",
            category.ctaClass,
          )}
        >
          {category.cta}
          <Icon name="arrow_forward" className="text-[16px]" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-lg transition-shadow hover:-translate-y-0.5 hover:shadow-md md:col-span-2 lg:col-span-2">
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full transition-transform group-hover:scale-110",
          category.bubbleClass,
        )}
      />
      <div>
        <Icon name={category.icon} className={cn("mb-md text-[40px]", category.iconClass)} filled />
        <h3 className="text-headline-md text-primary">{category.title}</h3>
        <p className="mt-xs text-body-md text-on-surface-variant">{category.meta}</p>
      </div>
      <div className="mt-xl space-y-sm">
        {category.items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full cursor-pointer items-center gap-sm rounded-lg bg-surface-container-low p-sm text-label-md font-bold text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name={item.icon} className="text-[18px]" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={cn(
          "mt-lg flex items-center gap-xs text-label-md font-bold uppercase tracking-wider transition-transform group-hover:translate-x-1",
          category.ctaClass,
        )}
      >
        {category.cta}
        <Icon name="arrow_forward" className="text-[16px]" />
      </button>
    </div>
  );
}

export function LibraryArchives() {
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0]);

  return (
    <>
      <section className="space-y-md">
        <div className="flex items-center gap-sm border-b border-outline-variant pb-xs">
          <Icon name="auto_stories" className="text-secondary" />
          <h2 className="text-headline-lg text-primary">Ressources pédagogiques</h2>
        </div>
        <div className="grid grid-cols-1 gap-md md:grid-cols-4 lg:grid-cols-6">
          {RESOURCE_CATEGORIES.map((category) => (
            <ResourceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="space-y-md">
        <div className="flex items-center justify-between border-b border-outline-variant pb-xs">
          <div className="flex items-center gap-sm">
            <Icon name="folder_zip" className="text-secondary" />
            <h2 className="text-headline-lg text-primary">Archives des activités</h2>
          </div>
          <select
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
            className="cursor-pointer border-none bg-transparent text-label-md font-bold text-on-surface-variant focus:ring-0"
          >
            {ACADEMIC_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 border-b border-outline-variant bg-surface-container-low">
                <tr>
                  {["Nom du document", "Catégorie", "Date", "Statut", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-lg py-md text-label-md font-bold uppercase tracking-wider text-on-surface-variant"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {ARCHIVE_DOCUMENTS.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded",
                            doc.iconClass,
                          )}
                        >
                          <Icon name={doc.icon} />
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{doc.name}</div>
                          <div className="text-[12px] text-on-surface-variant">{doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md text-body-md text-on-surface-variant">
                      {doc.category}
                    </td>
                    <td className="px-lg py-md text-body-md text-on-surface-variant">{doc.date}</td>
                    <td className="px-lg py-md">
                      <span
                        className={cn(
                          "inline-flex items-center gap-xs rounded px-sm py-xs text-label-md font-bold",
                          doc.statusClass,
                        )}
                      >
                        {doc.status === "Officiel" ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        ) : null}
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <button
                          type="button"
                          className="rounded p-xs text-on-surface-variant hover:bg-surface-container-highest"
                          aria-label="Voir le document"
                        >
                          <Icon name="visibility" className="text-[20px]" />
                        </button>
                        <button
                          type="button"
                          className="rounded p-xs text-on-surface-variant hover:bg-surface-container-highest"
                          aria-label="Télécharger"
                        >
                          <Icon name="download" className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between bg-surface-container-low px-lg py-md">
            <span className="text-label-md text-on-surface-variant">
              Affichage de 3 sur 45 documents archivés
            </span>
            <div className="flex gap-xs">
              <button
                type="button"
                disabled
                className="rounded border border-outline-variant bg-surface-container-lowest p-sm hover:bg-surface-container-high disabled:opacity-50"
                aria-label="Page précédente"
              >
                <Icon name="chevron_left" className="text-[18px]" />
              </button>
              <button
                type="button"
                className="rounded border border-outline-variant bg-surface-container-lowest p-sm hover:bg-surface-container-high"
                aria-label="Page suivante"
              >
                <Icon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative grid grid-cols-1 gap-xl overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest lg:grid-cols-12">
        <div className="flex flex-col justify-center p-xl lg:col-span-7">
          <span className="mb-md self-start rounded bg-secondary-container px-sm py-xs text-label-md font-bold text-on-secondary-container">
            {FEATURED_GUIDE.badge}
          </span>
          <h2 className="mb-md text-display-lg text-primary">{FEATURED_GUIDE.title}</h2>
          <p className="mb-xl max-w-[32rem] text-body-lg text-on-surface-variant">
            {FEATURED_GUIDE.description}
          </p>
          <div className="flex flex-wrap gap-md">
            <button
              type="button"
              className="flex items-center gap-md rounded-xl bg-primary px-xl py-md font-bold text-on-primary transition-transform hover:scale-[1.02]"
            >
              Télécharger maintenant
              <Icon name="download" />
            </button>
            <button
              type="button"
              className="rounded-xl border border-outline px-xl py-md font-bold text-primary transition-colors hover:bg-surface-container-high"
            >
              Lire l&apos;aperçu
            </button>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden lg:col-span-5 lg:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={FEATURED_GUIDE.title}
            className="h-full w-full object-cover"
            src={FEATURED_GUIDE.image}
          />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-surface-container-lowest to-transparent lg:block" />
        </div>
      </section>
    </>
  );
}
