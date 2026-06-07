import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { StatsOverview } from "@/lib/api/types";
import { formatEventDate } from "@/lib/catalog-display";
import { formatFinanceDate, formatGnf, formatSignedGnf } from "@/lib/finance-display";

const DEFAULT_EVENT_POSTER = "/brand/events/cjp-forum-web.jpg";

type DashboardLivePanelsProps = {
  stats: StatsOverview | null;
};

export function DashboardLivePanels({ stats }: DashboardLivePanelsProps) {
  if (!stats) {
    return (
      <p className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
        Statistiques indisponibles pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="cjp-card-dark p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-[var(--cjp-white)]">Activité financière récente</h3>
        <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
          Solde net {formatGnf(stats.netBalance)} · {stats.pendingMembers} inscription
          {stats.pendingMembers > 1 ? "s" : ""} en attente
        </p>
        <div className="mt-6 space-y-3">
          {stats.recentTransactions.length === 0 ? (
            <p className="text-sm text-[var(--cjp-text-muted)]">Aucune transaction enregistrée.</p>
          ) : (
            stats.recentTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-[var(--cjp-border)] pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--cjp-white)]">
                    {item.description}
                  </p>
                  <p className="text-xs text-[var(--cjp-text-muted)]">
                    {formatFinanceDate(item.transactionAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    item.type === "INCOME" ? "text-[var(--cjp-gold)]" : "text-red-400"
                  }`}
                >
                  {formatSignedGnf(item.type === "INCOME" ? item.amount : -item.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-[var(--cjp-border)]">
        {stats.nextEvent ? (
          <>
            <img
              src={stats.nextEvent.posterUrl ?? DEFAULT_EVENT_POSTER}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--cjp-black)] via-[var(--cjp-black)]/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <span className="cjp-badge-gold mb-3 w-fit">Prochain événement</span>
              <h3 className="text-xl font-bold text-[var(--cjp-white)]">{stats.nextEvent.title}</h3>
              <div className="mt-3 flex flex-col gap-1 text-xs text-[var(--cjp-text-muted)]">
                <span>{formatEventDate(stats.nextEvent.startAt, null)}</span>
                <span>{stats.nextEvent.location ?? "Lieu à confirmer"}</span>
              </div>
              <Link to="/dashboard/evenements" className="btn-cjp mt-6 w-fit !py-3 !text-xs">
                GÉRER L&apos;ÉVÉNEMENT
                <span className="cjp-btn-arrow">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucun événement à venir publié.
          </div>
        )}
      </div>
    </div>
  );
}
