

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { getCoursePlayerData } from "@/features/formations/data/course-player-data";
import {
  ACTIVE_COURSES,
  FORMATION_CATEGORIES,
  FORMATION_COURSES,
  SORT_OPTIONS,
  type FormationCategory,
  type SortOption,
} from "@/features/formations/data/formations-data";
import { cn } from "@/lib/utils";

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-container-high", className)}>
      <div className="h-full rounded-full bg-secondary" style={{ width: `${value}%` }} />
    </div>
  );
}

function FormationCard({
  course,
}: {
  course: (typeof FORMATION_COURSES)[number];
}) {
  const courseUrl = getCoursePlayerData(course.id)
    ? `/dashboard/formations/cours/${course.id}`
    : undefined;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all hover:shadow-md">
      <div className="relative h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={course.image}
        />
        <div
          className={cn(
            "absolute right-sm top-sm rounded-lg px-sm py-xs text-[10px] font-bold",
            course.badgeClass,
          )}
        >
          {course.badge}
        </div>
        {courseUrl ? (
          <Link
            to={courseUrl}
            className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Ouvrir ${course.title}`}
          >
            <Icon name="play_circle" className="text-4xl text-white" filled />
          </Link>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Icon name="play_circle" className="text-4xl text-white" filled />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-lg">
        <h4 className="text-headline-md leading-tight text-primary">{course.title}</h4>

        <div className="mb-md mt-sm flex gap-md text-label-md text-on-surface-variant">
          <span className="flex items-center gap-xs">
            <Icon name="schedule" className="text-[16px]" />
            {course.duration}
          </span>
          <span className="flex items-center gap-xs">
            <Icon name="bar_chart" className="text-[16px]" />
            {course.difficulty}
          </span>
        </div>

        {course.status === "completed" && (
          <>
            <div className="mb-lg">
              <div className="mb-1 flex justify-between">
                <span className="text-[10px] text-on-surface-variant">Terminée</span>
                <span className="text-[10px] font-bold text-secondary">100%</span>
              </div>
              <ProgressBar value={100} />
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary py-md text-label-md text-white transition-all hover:brightness-110"
            >
              <Icon name="workspace_premium" className="text-[18px]" />
              Obtenir le certificat
            </button>
          </>
        )}

        {course.status === "in_progress" && (
          <>
            <div className="mb-lg">
              <div className="mb-1 flex justify-between">
                <span className="text-[10px] text-on-surface-variant">En cours</span>
                <span className="text-[10px] font-bold text-on-surface-variant">
                  {course.progress}%
                </span>
              </div>
              <ProgressBar value={course.progress ?? 0} />
            </div>
            {courseUrl ? (
              <Link
                to={courseUrl}
                className="block w-full rounded-lg bg-primary py-md text-center text-label-md text-white transition-all hover:bg-on-primary-fixed-variant"
              >
                Continuer la formation
              </Link>
            ) : (
              <button
                type="button"
                className="w-full rounded-lg bg-primary py-md text-label-md text-white transition-all hover:bg-on-primary-fixed-variant"
              >
                Continuer la formation
              </button>
            )}
          </>
        )}

        {course.status === "not_started" && (
          <div className="mt-auto pt-lg">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-sm rounded-lg border border-primary py-md text-label-md text-primary transition-all hover:bg-surface-container-low"
            >
              S&apos;inscrire
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function FormationsCatalog() {
  const [category, setCategory] = useState<FormationCategory>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const filteredCourses = useMemo(() => {
    let courses = [...FORMATION_COURSES];
    if (category !== "all") {
      courses = courses.filter((course) => course.category === category);
    }
    if (sort === "difficulty") {
      const order = ["Débutant", "Intermédiaire", "Avancé", "Expert"];
      courses.sort((a, b) => order.indexOf(a.difficulty) - order.indexOf(b.difficulty));
    }
    return courses;
  }, [category, sort]);

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        <div className="order-2 space-y-lg lg:order-1 lg:col-span-3">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
            <h3 className="mb-md text-headline-md">Catégories</h3>
            <div className="flex flex-wrap gap-sm lg:flex-col">
              {FORMATION_CATEGORIES.map((item) => {
                const active = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={cn(
                      "flex items-center gap-sm rounded-lg px-md py-sm text-label-md transition-colors",
                      active
                        ? "bg-primary-container text-white"
                        : "text-on-surface-variant hover:bg-surface-container-high",
                    )}
                  >
                    <Icon name={item.icon} className="text-[18px]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
            <div className="mb-md flex items-center justify-between">
              <h3 className="text-headline-md">Mes formations actives</h3>
              <span className="rounded-full bg-secondary-container px-sm py-0.5 text-[10px] font-bold text-on-secondary-container">
                2 EN COURS
              </span>
            </div>
            <div className="space-y-md">
              {ACTIVE_COURSES.map((course) => {
                const activeCourseUrl = getCoursePlayerData(course.id)
                  ? `/dashboard/formations/cours/${course.id}`
                  : undefined;
                const content = (
                  <>
                    <p className="mb-1 text-label-md text-primary">{course.title}</p>
                    <div className="mb-1 h-1.5 w-full rounded-full bg-surface-container-high">
                      <div
                        className="h-1.5 rounded-full bg-secondary"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-on-surface-variant">
                        {course.progress}% complété
                      </span>
                      <span className="text-[10px] font-bold text-secondary group-hover:underline">
                        Reprendre
                      </span>
                    </div>
                  </>
                );

                if (activeCourseUrl) {
                  return (
                    <Link key={course.id} to={activeCourseUrl} className="group block">
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={course.id} className="group cursor-pointer">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary p-lg text-white shadow-md">
            <div className="relative z-10">
              <h4 className="mb-xs text-headline-md text-white">Votre progression</h4>
              <p className="mb-md text-[12px] text-primary-fixed-dim">
                Top 5% des membres ce mois-ci
              </p>
              <div className="flex gap-md">
                <div>
                  <span className="block text-xl font-bold">12</span>
                  <span className="text-[10px] uppercase opacity-70">Certificats</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <span className="block text-xl font-bold">140h</span>
                  <span className="text-[10px] uppercase opacity-70">Temps d&apos;apprentissage</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Icon name="emoji_events" className="text-[100px]" filled />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-9">
          <div className="mb-lg flex flex-col justify-between gap-md md:flex-row md:items-center">
            <div className="custom-scrollbar flex items-center gap-md overflow-x-auto pb-sm md:pb-0">
              <span className="whitespace-nowrap text-label-md text-on-surface-variant">
                Trier par :
              </span>
              {SORT_OPTIONS.map((option) => {
                const active = sort === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSort(option.id)}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-md py-sm text-label-md transition-colors",
                      active
                        ? "border-outline bg-primary text-white"
                        : "border-outline-variant bg-white text-on-surface-variant",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="text-label-md text-on-surface-variant">
              Affichage de <span className="font-bold text-primary">{filteredCourses.length}</span>{" "}
              formations
            </div>
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <FormationCard key={course.id} course={course} />
            ))}
          </div>

          <div className="mt-xl flex items-center justify-center gap-sm">
            <button
              type="button"
              className="rounded-lg p-sm text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
              disabled
            >
              <Icon name="chevron_left" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={cn(
                  "h-8 w-8 rounded-lg text-label-md",
                  page === 1
                    ? "bg-primary font-bold text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                {page}
              </button>
            ))}
            <span className="text-on-surface-variant">...</span>
            <button
              type="button"
              className="h-8 w-8 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-high"
            >
              8
            </button>
            <button
              type="button"
              className="rounded-lg p-sm text-on-surface-variant hover:bg-surface-container-high"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
