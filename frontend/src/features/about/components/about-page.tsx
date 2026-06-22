import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpParticles } from "@/components/cjp/cjp-particles";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import {
  ABOUT_HERO_IMAGE,
  ABOUT_PARTNERS,
  ABOUT_STORY_IMAGE,
  ABOUT_VALUES,
} from "@/features/about/data/about-data";
import { Icon } from "@/components/ui/icon";
import { fetchStatsOverview } from "@/lib/api/auth";
import { fetchBureau } from "@/lib/api/members";
import type { ApiBureauMember, StatsOverview } from "@/lib/api/types";
import { useCountUp } from "@/lib/use-count-up";

const CJP_FOUNDING_YEAR = 2016;

const BUREAU_ROLE_LABELS: Record<ApiBureauMember["role"], string> = {
  ADMINISTRATEUR: "Président",
  RESPONSABLE: "Responsable Technique",
  TRESORIER: "Trésorerie",
  FORMATEUR: "Formateur",
};

function AnimatedStatValue({ target, suffix = "" }: { target: number | null; suffix?: string }) {
  const value = useCountUp(target);
  return <>{value === null ? "—" : `${value}${suffix}`}</>;
}

export function AboutPage() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [bureau, setBureau] = useState<ApiBureauMember[] | null>(null);

  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStatsOverview()
      .then(setStats)
      .catch(() => setStats(null));
    fetchBureau()
      .then((data) => setBureau(data.bureau))
      .catch(() => setBureau(null));

  }, []);

  const yearsOfImpact = new Date().getFullYear() - CJP_FOUNDING_YEAR;

  const aboutStats = useMemo(
    () => [
      { target: yearsOfImpact, suffix: "+", label: "Années d'impact" },
      { target: stats ? stats.activeMembers : null, suffix: "", label: "Membres actifs" },
      { target: stats ? stats.publishedFormations : null, suffix: "", label: "Formations" },
      { target: stats ? stats.publishedProjects : null, suffix: "", label: "Projets" },
    ],
    [stats, yearsOfImpact],
  );

  /* Parallaxe souris sur le halo doré du hero. */
  const handleHeroMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${x * 40}px, ${y * 30}px)`;
    }
  };

  const handleHeroMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.transform = "translate(0, 0)";
  };

  return (
    <CjpPublicLayout variant="dark">
      <section
        className="relative min-h-[420px] overflow-hidden"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <img
          src={ABOUT_HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--cjp-black)] via-[var(--cjp-black)]/85 to-[var(--cjp-black)]/50" />
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(245,166,35,0.12),transparent_55%)] transition-transform duration-300 ease-out"
          aria-hidden
        />
        <CjpParticles count={36} />

        <div className="cjp-container relative z-10 flex min-h-[420px] flex-col justify-center py-16 md:py-20">
          <p className="cjp-label-gold cjp-anim-fade-up mb-4">
            Depuis {CJP_FOUNDING_YEAR} · Université de Labé
          </p>
          <div className="cjp-anim-fade-up cjp-anim-delay-1">
            <CjpDisplayTitle
              bold="Propulser"
              light="l'excellence numérique"
              className="max-w-[14ch] sm:max-w-none"
            />
          </div>
          <p className="cjp-text-lead cjp-anim-fade-up cjp-anim-delay-2 mt-6 text-base md:text-lg">
            Le Club des Jeunes Programmeurs est le cœur battant de l&apos;innovation technologique à
            l&apos;Université de Labé. Nous forgeons les leaders numériques de demain par
            l&apos;apprentissage collaboratif et l&apos;excellence technique.
          </p>
          <div className="cjp-anim-fade-up cjp-anim-delay-3 mt-8 flex flex-wrap gap-3">
            <CjpButton to="/inscription">REJOINDRE LE CLUB</CjpButton>
            <CjpButton to="/formations" variant="outline">
              NOS FORMATIONS
            </CjpButton>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--cjp-border)] bg-[var(--cjp-dark)] py-12">
        <div className="cjp-container grid grid-cols-2 gap-8 md:grid-cols-4">
          {aboutStats.map((stat, index) => (
            <CjpReveal key={stat.label} delay={index * 100} className="text-center">
              <p className="text-3xl font-bold text-[var(--cjp-gold)] md:text-4xl">
                <AnimatedStatValue target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--cjp-text-muted)]">
                {stat.label}
              </p>
            </CjpReveal>
          ))}
        </div>
      </section>

      <section className="bg-[var(--cjp-offwhite)] py-16 text-[var(--cjp-black)] md:py-20">
        <div className="cjp-container">
          <CjpReveal>
            <CjpDisplayTitle
              as="h2"
              bold="Notre"
              light="histoire"
              lightOnDark={false}
              className="!text-[clamp(2rem,4vw,3rem)]"
            />
          </CjpReveal>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <CjpReveal className="lg:col-span-7">
              <h3 className="text-xl font-bold text-[var(--cjp-black)]">
                Des racines académiques fortes
              </h3>
              <p className="cjp-text-lead mt-4 !text-[var(--cjp-black)]/70">
                Fondé en {CJP_FOUNDING_YEAR} au sein de l&apos;Université de Labé, le CJP est né
                d&apos;une vision simple : combler le fossé entre la théorie académique et la
                pratique industrielle. Ce qui n&apos;était qu&apos;un petit groupe d&apos;étudiants
                passionnés est devenu la plus grande communauté tech de la région.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                {aboutStats.slice(0, 2).map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-[var(--cjp-gold-dark)]">
                      <AnimatedStatValue target={stat.target} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--cjp-black)]/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </CjpReveal>
            <CjpReveal
              delay={150}
              className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_30%,#ccc)] lg:col-span-5"
            >
              <img
                src={ABOUT_STORY_IMAGE}
                alt="Événement tech du Club des Jeunes Programmeurs à Labé"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </CjpReveal>
          </div>
        </div>
      </section>

      <section className="cjp-polygon-bg relative overflow-hidden py-16 md:py-20">
        <CjpParticles count={18} />
        <div className="cjp-container relative z-10">
          <CjpReveal>
            <CjpDisplayTitle
              as="h2"
              bold="Nos"
              light="valeurs"
              className="!text-[clamp(2rem,4vw,3rem)]"
            />
            <p className="cjp-text-lead mt-4">
              Les principes qui guident chaque atelier, hackathon et parcours de formation au sein
              du club.
            </p>
          </CjpReveal>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ABOUT_VALUES.map((value, index) => (
              <CjpReveal key={value.title} delay={index * 120}>
                <article className="cjp-card-dark cjp-press group h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-12px_rgba(245,166,35,0.25)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon name={value.icon} className="text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--cjp-gold)]">{value.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[var(--cjp-text-muted)]">
                    {value.description}
                  </p>
                </article>
              </CjpReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--cjp-border)] bg-[var(--cjp-dark)] py-16 md:py-20">
        <div className="cjp-container">
          <CjpReveal>
            <CjpDisplayTitle
              as="h2"
              bold="L'équipe"
              light="de direction"
              className="!text-[clamp(2rem,4vw,3rem)]"
            />
            <p className="cjp-text-lead mt-4">
              Les esprits qui dirigent notre vision vers l&apos;excellence.
            </p>
          </CjpReveal>

          {bureau === null ? (
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="mb-4 aspect-square rounded-xl bg-[var(--cjp-border)]/30" />
                  <div className="h-4 w-3/4 rounded bg-[var(--cjp-border)]/30" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-[var(--cjp-border)]/20" />
                </div>
              ))}
            </div>
          ) : bureau.length === 0 ? (
            <p className="mt-12 text-sm text-[var(--cjp-text-muted)]">
              L&apos;équipe de direction sera bientôt présentée ici.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {bureau.map((leader, index) => (
                <CjpReveal key={leader.id} delay={index * 100}>
                  <div className="group text-center md:text-left">
                    <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[var(--cjp-border)] bg-gradient-to-br from-[var(--cjp-dark)] via-[var(--cjp-black)] to-[var(--cjp-dark)] transition-all duration-300 group-hover:border-[var(--cjp-gold)]/40 group-hover:shadow-[0_12px_32px_-12px_rgba(245,166,35,0.3)]">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(245,166,35,0.12),transparent_60%)]"
                        aria-hidden
                      />
                      <span className="text-4xl font-bold text-[var(--cjp-gold)] transition-transform duration-500 group-hover:scale-110 md:text-5xl">
                        {leader.initials}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--cjp-white)]">
                      {leader.firstName} {leader.lastName}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                      {leader.bureauTitle || BUREAU_ROLE_LABELS[leader.role]}
                    </p>
                  </div>
                </CjpReveal>
              ))}
            </div>
          )}
        </div>
      </section>


      <section className="border-t border-[var(--cjp-border)] py-14">
        <div className="cjp-container">
          <CjpReveal>
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cjp-text-muted)]">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
              {ABOUT_PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center gap-3 opacity-70 transition-all duration-300 hover:scale-105 hover:opacity-100"
                >
                  <Icon name={partner.icon} className="text-3xl text-[var(--cjp-gold)]" />
                  <span className="text-sm font-bold uppercase tracking-wider text-[var(--cjp-white)]">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link to="/membres" className="cjp-detail-link !text-[var(--cjp-gold)]">
                DÉCOUVRIR L&apos;ESPACE MEMBRE
                <span className="cjp-detail-arrow !bg-[var(--cjp-gold)] !text-[var(--cjp-black)]">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </CjpReveal>
        </div>
      </section>
    </CjpPublicLayout>
  );
}
