import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import {
  ABOUT_HERO_IMAGE,
  ABOUT_LEADERS,
  ABOUT_PARTNERS,
  ABOUT_STATS,
  ABOUT_STORY_IMAGE,
  ABOUT_VALUES,
} from "@/features/about/data/about-data";
import { Icon } from "@/components/ui/icon";

export function AboutPage() {
  return (
    <CjpPublicLayout variant="dark">
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src={ABOUT_HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--cjp-black)] via-[var(--cjp-black)]/85 to-[var(--cjp-black)]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(245,166,35,0.12),transparent_55%)]" />

        <div className="cjp-container relative z-10 flex min-h-[420px] flex-col justify-center py-16 md:py-20">
          <p className="cjp-label-gold mb-4">Depuis 2016 · Université de Labé</p>
          <CjpDisplayTitle
            bold="Propulser"
            light="l'excellence numérique"
            className="max-w-[14ch] sm:max-w-none"
          />
          <p className="cjp-text-lead mt-6 text-base md:text-lg">
            Le Club des Jeunes Programmeurs est le cœur battant de l&apos;innovation technologique à
            l&apos;Université de Labé. Nous forgeons les leaders numériques de demain par
            l&apos;apprentissage collaboratif et l&apos;excellence technique.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CjpButton to="/inscription">REJOINDRE LE CLUB</CjpButton>
            <CjpButton to="/formations" variant="outline">
              NOS FORMATIONS
            </CjpButton>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--cjp-border)] bg-[var(--cjp-dark)] py-12">
        <div className="cjp-container grid grid-cols-2 gap-8 md:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[var(--cjp-gold)] md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--cjp-text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--cjp-gold)] md:text-4xl">120+</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--cjp-text-muted)]">
              Membres actifs
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--cjp-gold)] md:text-4xl">24</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--cjp-text-muted)]">
              Formations
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--cjp-offwhite)] py-16 text-[var(--cjp-black)] md:py-20">
        <div className="cjp-container">
          <CjpDisplayTitle
            as="h2"
            bold="Notre"
            light="histoire"
            lightOnDark={false}
            className="!text-[clamp(2rem,4vw,3rem)]"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h3 className="text-xl font-bold text-[var(--cjp-black)]">
                Des racines académiques fortes
              </h3>
              <p className="cjp-text-lead mt-4 !text-[var(--cjp-black)]/70">
                Fondé en 2016 au sein de l&apos;Université de Labé, le CJP est né d&apos;une vision
                simple : combler le fossé entre la théorie académique et la pratique industrielle.
                Ce qui n&apos;était qu&apos;un petit groupe d&apos;étudiants passionnés est devenu la
                plus grande communauté tech de la région.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                {ABOUT_STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-[var(--cjp-gold-dark)]">{stat.value}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--cjp-black)]/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_30%,#ccc)] lg:col-span-5">
              <img
                src={ABOUT_STORY_IMAGE}
                alt="Événement tech du Club des Jeunes Programmeurs à Labé"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cjp-polygon-bg py-16 md:py-20">
        <div className="cjp-container">
          <CjpDisplayTitle
            as="h2"
            bold="Nos"
            light="valeurs"
            className="!text-[clamp(2rem,4vw,3rem)]"
          />
          <p className="cjp-text-lead mt-4">
            Les principes qui guident chaque atelier, hackathon et parcours de formation au sein du
            club.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <article key={value.title} className="cjp-card-dark group p-6 transition-transform hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)] transition-transform group-hover:scale-105">
                  <Icon name={value.icon} className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-[var(--cjp-gold)]">{value.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[var(--cjp-text-muted)]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--cjp-border)] bg-[var(--cjp-dark)] py-16 md:py-20">
        <div className="cjp-container">
          <CjpDisplayTitle
            as="h2"
            bold="L'équipe"
            light="de direction"
            className="!text-[clamp(2rem,4vw,3rem)]"
          />
          <p className="cjp-text-lead mt-4">
            Les esprits qui dirigent notre vision vers l&apos;excellence.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {ABOUT_LEADERS.map((leader) => (
              <div key={leader.name} className="group text-center md:text-left">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-[var(--cjp-border)]">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold text-[var(--cjp-white)]">{leader.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  {leader.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--cjp-border)] py-14">
        <div className="cjp-container">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cjp-text-muted)]">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {ABOUT_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100"
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
        </div>
      </section>
    </CjpPublicLayout>
  );
}
