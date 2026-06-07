import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingSection } from "@/features/landing/components/landing-section";
import { Icon } from "@/components/ui/icon";
import {
  FOOTER_LINKS,
  HERO_IMAGE,
  LANDING_NAV,
  LANDING_STATS,
  MISSION_PILLARS,
  POLE_CARDS,
} from "@/features/landing/data/landing-data";
import { cn } from "@/lib/utils";

function poleCardClass(variant: (typeof POLE_CARDS)[number]["variant"]) {
  switch (variant) {
    case "glass":
      return "glass-card hover:shadow-md";
    case "featured":
      return "bg-primary-container text-white";
    case "outline":
      return "border border-outline-variant hover:bg-surface";
    case "accent":
      return "bg-secondary-container";
  }
}

export function LandingPage() {
  const navigate = useNavigate();

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/inscription");
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background font-body-md text-on-surface">
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/95 shadow-sm backdrop-blur-sm">
        <nav className="landing-container flex h-20 items-center justify-between">
          <Link to="/" className="text-headline-lg font-bold text-primary">
            CJP HUB
          </Link>

          <div className="hidden items-center gap-lg md:flex">
            {LANDING_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-label-md transition-colors",
                  item.active
                    ? "border-b-2 border-primary pb-1 font-bold text-primary"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-md">
            <Link
              to="/connexion"
              className="hidden rounded-lg px-md py-sm text-label-md text-on-surface transition-all hover:bg-surface-container-low sm:block"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="rounded-lg bg-primary-container px-lg py-sm text-label-md text-on-primary-container transition-transform hover:scale-95 active:scale-90"
            >
              Rejoindre le club
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full flex-1">
        {/* Hero */}
        <LandingSection
          immediate
          className="landing-section relative overflow-hidden !pt-12 md:!pt-16"
        >
          <div className="relative flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-10">
            <div className="z-10 min-w-0 flex-1 space-y-lg">
              <div className="inline-flex items-center gap-xs rounded-full bg-secondary-container px-sm py-1 text-label-md text-on-secondary-container">
                <Icon name="verified" className="text-[16px]" />
                L&apos;excellence numérique à Labé
              </div>
              <h1 className="text-display-lg text-primary md:text-[56px] md:leading-[64px]">
                Bâtissons le futur du numérique à l&apos;Université de Labé
              </h1>
              <p className="max-w-[36rem] text-body-lg leading-relaxed text-on-surface-variant">
                Rejoignez le Club des Jeunes Programmeurs pour transformer vos compétences en
                expertise certifiée à travers des projets réels et un encadrement professionnel.
              </p>
              <div className="flex flex-wrap gap-md pt-sm">
                <Link
                  to="/inscription"
                  className="rounded-lg bg-primary px-xl py-md text-headline-md text-on-primary transition-shadow hover:shadow-lg active:scale-95"
                >
                  S&apos;inscrire au club
                </Link>
                <Link
                  to="/connexion"
                  className="rounded-lg border-2 border-primary px-xl py-md text-headline-md text-primary transition-all hover:bg-surface-container-low"
                >
                  Connexion membre
                </Link>
              </div>
            </div>

            <div className="relative min-h-[240px] min-w-0 flex-1 overflow-hidden rounded-2xl shadow-2xl md:min-h-[360px] md:aspect-video">
              <img
                alt="Étudiants en informatique au laboratoire du CJP à Labé"
                className="h-full w-full object-cover"
                src={HERO_IMAGE}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-secondary-container/20 blur-[100px]" />
        </LandingSection>

        {/* Stats — bande pleine largeur */}
        <LandingSection
          bleed
          className="border-y border-outline-variant bg-primary-container py-10 text-white md:py-12"
        >
          <div className="landing-container grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-10">
            {LANDING_STATS.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-display-lg text-secondary-fixed">{stat.value}</div>
                <div className="text-label-md uppercase tracking-widest text-on-primary-container">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </LandingSection>

        {/* Mission */}
        <LandingSection id="mission" className="landing-section">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-md text-headline-lg text-primary">Apprendre, Partager, Exceller</h2>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">
              Le CJP est bien plus qu&apos;un club ; c&apos;est le pôle central de
              l&apos;innovation informatique à l&apos;Université de Labé. Nous créons un
              écosystème où chaque étudiant guinéen peut développer son potentiel créatif et
              technique.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-lg md:mt-12 md:grid-cols-3">
            {MISSION_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="group rounded-xl border border-outline-variant bg-surface-container-low p-lg transition-colors hover:border-secondary"
              >
                <div className="mb-md flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white transition-colors group-hover:bg-secondary">
                  <Icon name={pillar.icon} filled={pillar.filled} />
                </div>
                <h3 className="mb-sm text-headline-md text-primary">{pillar.title}</h3>
                <p className="text-body-md text-on-surface-variant">{pillar.description}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        {/* Pôles */}
        <LandingSection bleed className="bg-surface-container-lowest landing-section">
          <div className="landing-container">
            <div className="mb-10 md:mb-12">
              <h2 className="text-display-lg text-primary">Nos Pôles d&apos;Activités</h2>
              <p className="mt-sm max-w-2xl text-body-lg text-on-surface-variant">
                Une structure complète pour votre parcours académique et professionnel.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-md md:h-[520px] md:grid-cols-12 md:grid-rows-2">
            {POLE_CARDS.map((pole) => (
              <Link
                key={pole.id}
                to={pole.href}
                className={cn(
                  "group flex min-h-[160px] flex-col justify-between rounded-xl p-6 transition-all md:p-8",
                  pole.className,
                  poleCardClass(pole.variant),
                  pole.variant === "featured" && "relative overflow-hidden",
                )}
              >
                <Icon
                  name={pole.icon}
                  className={cn(
                    "text-[32px]",
                    pole.variant === "featured" && "text-[40px] text-secondary-fixed",
                    pole.variant === "accent" && "text-on-secondary-container",
                    pole.variant !== "featured" && pole.variant !== "accent" && "text-primary",
                  )}
                />
                <div>
                  <h4
                    className={cn(
                      "text-headline-md",
                      pole.variant === "featured" && "mt-4 text-headline-lg",
                      pole.variant === "accent"
                        ? "text-on-secondary-container"
                        : "text-primary",
                    )}
                  >
                    {pole.title}
                  </h4>
                  <p
                    className={cn(
                      "mt-1 text-body-md leading-relaxed",
                      pole.variant === "featured" && "text-body-lg text-on-primary-container",
                      pole.variant === "accent"
                        ? "text-on-secondary-container/80"
                        : "text-on-surface-variant",
                    )}
                  >
                    {pole.description}
                  </p>
                </div>
                {pole.variant === "featured" && (
                  <>
                    <span className="z-10 mt-4 w-fit rounded-lg bg-secondary-fixed px-lg py-sm text-label-md text-on-secondary-fixed transition-transform group-hover:scale-105">
                      En savoir plus
                    </span>
                    <Icon
                      name={pole.decorIcon ?? "history_edu"}
                      className="absolute -bottom-10 -right-10 text-[200px] opacity-10 transition-transform group-hover:scale-110"
                    />
                  </>
                )}
              </Link>
            ))}
            </div>
          </div>
        </LandingSection>

        {/* Inscription */}
        <LandingSection id="join" className="landing-section">
          <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-xl md:flex-row">
            <div className="flex-1 space-y-6 bg-surface-bright p-8 md:p-10">
              <div className="space-y-2">
                <h3 className="text-headline-lg text-primary">Nouveaux membres</h3>
                <p className="text-body-lg leading-relaxed text-on-surface-variant">
                  Commencez votre voyage technologique aujourd&apos;hui et rejoignez la plus
                  grande communauté de codeurs de Labé.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary"
                    placeholder="Prénom"
                    type="text"
                  />
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary"
                    placeholder="Nom"
                    type="text"
                  />
                </div>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary"
                  placeholder="Email universitaire"
                  type="email"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 text-headline-md text-on-primary shadow-md transition-colors hover:bg-on-surface"
                >
                  S&apos;inscrire au club
                </button>
              </form>

              <p className="text-center text-label-md italic text-on-surface-variant">
                L&apos;adhésion est soumise à la validation de votre statut étudiant.
              </p>
            </div>

            <div className="relative flex w-full flex-col justify-center bg-primary-container p-8 text-white md:w-[320px] md:p-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-5"
                style={{
                  backgroundImage: "radial-gradient(#6ffbbe 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10 space-y-6">
                <h3 className="text-headline-lg">Déjà membre ?</h3>
                <p className="text-body-md leading-relaxed text-on-primary-container">
                  Accédez à votre tableau de bord, vos cours et vos certificats.
                </p>
                <Link
                  to="/connexion"
                  className="block w-full rounded-lg border-2 border-secondary-fixed py-3 text-center text-headline-md text-secondary-fixed transition-all hover:bg-secondary-fixed hover:text-on-secondary-fixed"
                >
                  Connexion membre
                </Link>
                <Link to="/connexion" className="flex items-center gap-3 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/10">
                    <Icon name="help" className="text-[20px]" />
                  </div>
                  <span className="text-body-md">Mot de passe oublié ?</span>
                </Link>
              </div>
            </div>
          </div>
        </LandingSection>
      </main>

      <footer className="w-full border-t border-outline-variant bg-primary-container py-10 md:py-12">
        <div className="landing-container flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="text-headline-md font-bold text-on-primary-container">CJP HUB</div>
            <p className="max-w-[28rem] text-body-md text-on-primary-container/80">
              © 2026 CJP HUB — Club des Jeunes Programmeurs, Université de Labé. Tous droits
              réservés.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-body-md text-on-primary-container/80 underline transition-all hover:text-secondary-fixed-dim"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
