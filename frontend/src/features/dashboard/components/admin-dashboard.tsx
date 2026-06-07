

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import {
  ADMIN_METRICS,
  FEATURED_EVENT,
  MEMBER_GROWTH,
  PENDING_REGISTRATIONS,
  QUICK_ACTIONS,
  RECENT_ACTIVITIES,
} from "@/features/dashboard/data/admin-dashboard-data";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimatedBars(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] space-y-lg">
      <div className="flex flex-col justify-between gap-md md:flex-row md:items-center">
        <div>
          <h2 className="text-display-lg text-primary">Portail administrateur du club</h2>
          <p className="text-body-lg text-on-surface-variant">
            Supervision en temps réel de votre communauté de programmeurs.
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            type="button"
            className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-high px-md py-sm text-label-md text-on-surface transition-colors hover:bg-surface-variant"
          >
            <Icon name="download" />
            Exporter les données
          </button>
          <Link
            to="/inscription"
            className="flex items-center gap-sm rounded-lg bg-secondary px-md py-sm text-label-md text-on-secondary transition-opacity hover:opacity-90"
          >
            <Icon name="add" filled />
            Inscription rapide
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-4">
        {ADMIN_METRICS.map((metric) => (
          <article
            key={metric.id}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-md flex items-start justify-between">
              <div className={cn("rounded-lg p-sm", metric.iconClass)}>
                <Icon
                  name={metric.icon}
                  filled={"filled" in metric ? Boolean(metric.filled) : false}
                />
              </div>
              {"trend" in metric && metric.trend && (
                <span
                  className={cn(
                    "flex items-center text-label-md",
                    metric.trendUp ? "text-secondary" : "text-error",
                  )}
                >
                  {metric.trend}
                  <Icon
                    name={metric.trendUp ? "trending_up" : "trending_down"}
                    className="text-[14px]"
                  />
                </span>
              )}
            </div>
            <p className="text-label-md uppercase tracking-wider text-on-surface-variant">
              {metric.label}
            </p>
            <p className="mt-xs text-display-lg">{metric.value}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm lg:col-span-2">
          <div className="mb-xl flex items-center justify-between">
            <div>
              <h3 className="text-headline-md text-primary">Croissance des membres</h3>
              <p className="text-body-md text-on-surface-variant">
                Tendances d&apos;inscription pour l&apos;année académique en cours.
              </p>
            </div>
            <select className="rounded-lg border-outline-variant bg-surface-container-low text-label-md focus:ring-secondary">
              <option>6 derniers mois</option>
              <option>Année complète</option>
            </select>
          </div>
          <div className="flex min-h-[300px] flex-1 items-end justify-between gap-sm pt-xl">
            {MEMBER_GROWTH.map((bar, index) => (
              <div key={bar.month} className="group flex w-full flex-col items-center">
                <div
                  className={cn(
                    "chart-bar w-full rounded-t-lg bg-secondary transition-all duration-1000 ease-in-out group-hover:opacity-100",
                    bar.opacity || "",
                    !bar.opacity && "opacity-100",
                  )}
                  style={{
                    height: animatedBars ? `${bar.height}%` : "0%",
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
                <span className="mt-sm text-label-md text-on-surface-variant">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          <div className="mb-lg flex items-center justify-between">
            <h3 className="text-headline-md text-primary">Activité récente</h3>
            <button type="button" className="text-label-md text-secondary hover:underline">
              Tout voir
            </button>
          </div>
          <div className="max-h-[400px] space-y-lg overflow-y-auto pr-sm">
            {RECENT_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                className={cn("flex gap-md border-l-2 py-sm pl-md", activity.borderClass)}
              >
                {activity.avatar ? (
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" className="h-full w-full object-cover" src={activity.avatar} />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      activity.iconClass,
                    )}
                  >
                    <Icon name={activity.icon!} />
                  </div>
                )}
                <div>
                  <p className="text-body-md font-bold text-on-surface">{activity.title}</p>
                  <p className="text-label-md text-on-surface-variant">{activity.subtitle}</p>
                  <p className="mt-xs font-mono text-[13px] leading-[18px] text-outline">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-md">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className={cn(
                "group flex flex-col items-center justify-center gap-md rounded-xl p-lg transition-all",
                action.className,
              )}
            >
              <Icon
                name={action.icon}
                className="text-[32px] transition-transform group-hover:scale-110"
              />
              <span className="text-headline-md">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-xl bg-primary p-lg text-white">
          <div className="absolute inset-0 opacity-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={FEATURED_EVENT.title}
              className="h-full w-full object-cover"
              src={FEATURED_EVENT.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
          </div>
          <div className="relative z-10">
            <span className="mb-sm inline-block rounded bg-secondary px-sm py-xs text-[10px] font-bold uppercase tracking-widest text-on-secondary">
              {FEATURED_EVENT.badge}
            </span>
            <h3 className="mb-xs text-headline-lg">{FEATURED_EVENT.title}</h3>
            <div className="flex items-center gap-lg text-label-md text-white/80">
              <span className="flex items-center gap-xs">
                <Icon name="calendar_today" className="text-[16px]" />
                {FEATURED_EVENT.dates}
              </span>
              <span className="flex items-center gap-xs">
                <Icon name="location_on" className="text-[16px]" />
                {FEATURED_EVENT.location}
              </span>
            </div>
            <div className="mt-lg flex items-center justify-between">
              <div className="flex -space-x-2">
                {FEATURED_EVENT.attendees.map((avatar) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={avatar}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-primary object-cover"
                    src={avatar}
                  />
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-surface-variant text-[10px] font-bold text-primary">
                  +{FEATURED_EVENT.extraAttendees}
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg bg-white px-lg py-sm text-label-md text-primary transition-all hover:bg-secondary hover:text-white"
              >
                Gérer les participants
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-lg">
          <h3 className="text-headline-md text-primary">Inscriptions membres en attente</h3>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              className="p-xs text-on-surface-variant transition-colors hover:text-primary"
              aria-label="Filtrer"
            >
              <Icon name="filter_list" />
            </button>
            <button
              type="button"
              className="p-xs text-on-surface-variant transition-colors hover:text-primary"
              aria-label="Plus d'options"
            >
              <Icon name="more_vert" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low text-[11px] font-label-md uppercase tracking-wider text-on-surface-variant">
                <th className="p-lg">Nom du membre</th>
                <th className="p-lg">Filière</th>
                <th className="p-lg">Date d&apos;inscription</th>
                <th className="p-lg">Statut paiement</th>
                <th className="p-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {PENDING_REGISTRATIONS.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="p-lg">
                    <div className="flex items-center gap-md">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold",
                          row.initialsClass,
                        )}
                      >
                        {row.initials}
                      </div>
                      <span className="text-body-md font-bold text-primary">{row.name}</span>
                    </div>
                  </td>
                  <td className="p-lg text-on-surface-variant">{row.department}</td>
                  <td className="p-lg text-on-surface-variant">{row.date}</td>
                  <td className="p-lg">
                    <span
                      className={cn(
                        "rounded-full px-sm py-xs text-[10px] font-bold uppercase tracking-tight",
                        row.statusClass,
                      )}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className="p-lg">
                    <button
                      type="button"
                      className="text-label-md text-secondary hover:underline"
                    >
                      Voir le profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-low p-md text-center">
          <Link
            to="/dashboard/admin"
            className="text-label-md text-outline transition-colors hover:text-primary"
          >
            Voir la liste complète des membres
          </Link>
        </div>
      </div>
    </div>
  );
}
