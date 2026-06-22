import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Award,
  CalendarDays,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { DashboardLivePanels } from "@/features/dashboard/components/dashboard-live-panels";
import { PendingRegistrationsPanel } from "@/features/dashboard/components/pending-registrations-panel";
import { PendingEventRegistrationsPanel } from "@/features/dashboard/components/pending-event-registrations-panel";
import { CampaignAdminPanel } from "@/features/dashboard/components/campaign-admin-panel";
import { CJP_DASHBOARD_POLES } from "@/features/dashboard/data/admin-dashboard-data";
import { fetchStatsOverview } from "@/lib/api/auth";
import type { StatsOverview } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const METRIC_ICONS = {
  active: Users,
  contributions: Wallet,
  courses: CalendarDays,
  certificates: Award,
} as const;

function formatGnf(value: number) {
  return `${value.toLocaleString("fr-FR")} GNF`;
}

export function CjpAdminDashboard() {
  const [stats, setStats] = useState<StatsOverview | null>(null);

  useEffect(() => {
    fetchStatsOverview()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const metrics = [
    {
      id: "active",
      label: "Membres actifs",
      value: stats ? String(stats.activeMembers) : "—",
      trend: stats ? `${stats.pendingMembers} en attente` : "Chargement…",
      trendUp: true,
    },
    {
      id: "contributions",
      label: "Cotisations reçues",
      value: stats ? formatGnf(stats.cotisationsReceived) : "—",
      trend: stats ? formatGnf(stats.netBalance) : "Solde net",
      trendUp: stats ? stats.netBalance >= 0 : true,
    },
    {
      id: "courses",
      label: "Formations publiées",
      value: stats ? String(stats.publishedFormations) : "—",
      trend: stats ? `${stats.upcomingEvents} événements` : "À venir",
      trendUp: true,
    },
    {
      id: "certificates",
      label: "Projets publiés",
      value: stats ? String(stats.publishedProjects) : "—",
      trend: stats ? `${stats.libraryResources} ressources` : "Bibliothèque",
      trendUp: true,
    },
  ] as const;

  return (
    <div className="space-y-10">
      <section className="cjp-dashboard-hero">
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className="cjp-label-gold mb-4">Administration · Vue d&apos;ensemble</p>
            <CjpDisplayTitle
              as="h1"
              bold="Tableau"
              light="de bord admin"
              className="!text-[clamp(2rem,4vw,3rem)]"
            />
            <p className="cjp-text-lead mt-4 text-base md:text-lg">
              Supervision en temps réel de la communauté CJP — membres, cotisations, formations et
              certificats.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {metrics.slice(0, 3).map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-full border border-[var(--cjp-border)] bg-[var(--cjp-black)]/40 px-4 py-2"
                >
                  <span className="mr-2 font-bold text-[var(--cjp-gold)]">{metric.value}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--cjp-text-muted)]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--cjp-border)] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-white)] transition-colors hover:border-[var(--cjp-gold)] hover:text-[var(--cjp-gold)]"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            <CjpButton to="/inscription" className="!py-3 !text-xs">
              INSCRIPTION RAPIDE
            </CjpButton>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = METRIC_ICONS[metric.id as keyof typeof METRIC_ICONS];
          return (
            <article key={metric.id} className="cjp-card-dark p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.trendUp ? "text-[var(--cjp-gold)]" : "text-red-400",
                  )}
                >
                  {metric.trendUp ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {metric.trend}
                </span>
              </div>
              <p className="cjp-label-gold">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-[var(--cjp-white)]">{metric.value}</p>
            </article>
          );
        })}
      </div>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--cjp-gold)]">Accès rapide — 6 pôles</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {CJP_DASHBOARD_POLES.map((pole) => (
            <Link
              key={pole.id}
              to={pole.href}
              className="cjp-card-dark group flex flex-col items-center gap-3 p-5 text-center transition-transform hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-lg font-bold text-[var(--cjp-black)]">
                {pole.title.slice(0, 1)}
              </span>
              <span className="text-sm font-semibold text-[var(--cjp-white)]">{pole.title}</span>
              <ArrowUpRight className="h-4 w-4 text-[var(--cjp-gold)] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <DashboardLivePanels stats={stats} />

      <CampaignAdminPanel />

      <div className="cjp-card-dark p-6">
        <h3 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">Actions rapides</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Nouveau membre", href: "/inscription", accent: true },
            { label: "Créer un événement", href: "/dashboard/evenements", accent: true },
            { label: "Facturation", href: "/dashboard/tresorerie/paiement", accent: false },
            { label: "Envoyer un message", href: "/dashboard/messages", accent: false },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={cn(
                "flex items-center justify-center rounded-xl p-4 text-center text-xs font-semibold uppercase tracking-wider transition-colors",
                action.accent
                  ? "bg-[var(--cjp-gold)] text-[var(--cjp-black)] hover:bg-[var(--cjp-gold-dark)]"
                  : "border border-[var(--cjp-border)] text-[var(--cjp-white)] hover:border-[var(--cjp-gold)] hover:text-[var(--cjp-gold)]",
              )}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <PendingRegistrationsPanel />
      <PendingEventRegistrationsPanel />
    </div>
  );
}
