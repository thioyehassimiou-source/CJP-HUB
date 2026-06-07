import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { HOME_POLES, HOME_STATS } from "@/features/public/data/public-data";
import { fetchStatsOverview } from "@/lib/api/auth";
import type { StatsOverview } from "@/lib/api/types";

function buildHomeStats(stats: StatsOverview | null) {
  if (!stats) {
    return HOME_STATS.map((item) => ({ value: item.value, label: item.label }));
  }

  return [
    { value: String(stats.activeMembers), label: "Membres actifs" },
    { value: String(stats.publishedFormations), label: "Formations" },
    { value: String(stats.upcomingEvents), label: "Événements" },
    { value: String(stats.publishedProjects), label: "Projets" },
  ];
}

export function CjpHomePage() {
  const [stats, setStats] = useState<StatsOverview | null>(null);

  useEffect(() => {
    fetchStatsOverview()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const homeStats = useMemo(() => buildHomeStats(stats), [stats]);
  const heroHighlights = homeStats.slice(0, 3);

  return (
    <CjpPublicLayout variant="dark">
      <section className="cjp-polygon-bg relative overflow-hidden py-16 md:py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(245,166,35,0.08),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--cjp-gold)]/25 to-transparent"
          aria-hidden
        />

        <div className="cjp-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
            <div className="lg:col-span-7">
              <p className="cjp-label-gold mb-5">Université de Labé · Club des Jeunes Programmeurs</p>

              <CjpDisplayTitle
                bold="Gérez"
                light="tout avec CJP Hub"
                className="max-w-[18ch] sm:max-w-none"
              />

              <p className="cjp-text-lead mt-6 text-base md:text-lg">
                La plateforme numérique intégrée du Club des Jeunes Programmeurs — formations,
                événements, trésorerie et projets, centralisés pour l&apos;Université de Labé.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroHighlights.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-full border border-[var(--cjp-border)] bg-[var(--cjp-dark)]/80 px-4 py-2 backdrop-blur-sm"
                  >
                    <span className="mr-2 font-bold text-[var(--cjp-gold)]">{stat.value}</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--cjp-text-muted)]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CjpButton to="/formations">NOS FORMATIONS</CjpButton>
                <CjpButton to="/inscription">REJOINDRE LE CLUB</CjpButton>
                <CjpButton to="/dashboard" variant="outline">
                  TABLEAU DE BORD
                </CjpButton>
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
                <div
                  className="absolute inset-0 scale-110 rounded-full bg-[var(--cjp-gold)]/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative flex aspect-square items-center justify-center rounded-full border border-[var(--cjp-border)] bg-[var(--cjp-dark)]/60 p-10 shadow-[0_0_80px_rgba(245,166,35,0.12)] backdrop-blur-sm">
                  <CjpLogo variant="on-dark" size="xl" to={null} className="scale-110" />
                </div>

                <div className="absolute -right-2 top-8 hidden rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 shadow-lg sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cjp-text-muted)]">
                    Formations actives
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--cjp-gold)]">
                    {stats ? stats.publishedFormations : "—"}
                  </p>
                </div>

                <div className="absolute -left-2 bottom-10 hidden rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 shadow-lg sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cjp-text-muted)]">
                    Membres
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--cjp-white)]">
                    {stats ? stats.activeMembers : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--cjp-border)] bg-[var(--cjp-dark)] py-12">
        <div className="cjp-container grid grid-cols-2 gap-8 md:grid-cols-4">
          {homeStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[var(--cjp-gold)] md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--cjp-text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="cjp-polygon-bg py-16 md:py-20">
        <div className="cjp-container">
          <CjpDisplayTitle
            as="h2"
            bold="Six pôles"
            light="pour piloter le club"
            className="!text-[clamp(2rem,4vw,3rem)]"
          />
          <p className="mt-4 cjp-text-lead">
            Une structure complète pour votre parcours académique et professionnel au sein du CJP.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_POLES.map((pole) => (
              <Link
                key={pole.id}
                to={pole.href}
                className="cjp-card-dark group p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-sm font-bold text-[var(--cjp-black)]">
                  {pole.title.slice(0, 1)}
                </div>
                <h3 className="text-lg font-bold text-[var(--cjp-gold)]">{pole.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-[var(--cjp-text-muted)]">
                  {pole.description}
                </p>
                <span className="cjp-detail-link mt-6 opacity-0 transition-opacity group-hover:opacity-100">
                  EXPLORER
                  <span className="cjp-detail-arrow">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </CjpPublicLayout>
  );
}
