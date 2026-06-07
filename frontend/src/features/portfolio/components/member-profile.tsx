

import { useRef } from "react";
import { Link } from "react-router-dom";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import { Icon } from "@/components/ui/icon";
import {
  CERTIFICATIONS,
  COMPETENCIES,
  MEMBER_PROFILE,
  MEMBER_QR_CODE,
  MEMBER_STATS,
  PORTFOLIO_PROJECTS,
  SOCIAL_LINKS,
} from "@/features/portfolio/data/portfolio-data";
import { cn } from "@/lib/utils";

function MembershipCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const rotateX = (y - rect.height / 2) / 10;
      const rotateY = (rect.width / 2 - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="id-card-pattern relative flex h-64 flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-transform duration-200"
      >
        <div className="flex items-start justify-between p-lg">
          <div className="flex flex-col">
            <span className="text-headline-md font-extrabold text-primary">CJP HUB</span>
            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant">
              MEMBRE OFFICIEL
            </span>
          </div>
          <CjpLogo variant="on-light" size="xs" to={null} />
        </div>

        <div className="mt-auto flex items-end justify-between bg-primary p-lg text-on-primary">
          <div className="space-y-xs">
            <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Titulaire</p>
            <p className="text-headline-md">{MEMBER_PROFILE.cardName}</p>
            <p className="font-mono text-[10px] opacity-90">
              EXPIRE : {MEMBER_PROFILE.expires}
            </p>
          </div>
          <div className="rounded bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="QR Code membre" className="h-16 w-16" src={MEMBER_QR_CODE} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemberProfile() {
  return (
    <div className="mx-auto max-w-7xl space-y-xl">
      <section className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="flex flex-col justify-center space-y-md lg:col-span-2">
          <nav className="mb-sm flex items-center gap-sm text-on-surface-variant">
            <span className="text-label-md">PORTFOLIO</span>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-label-md font-bold text-primary">PROFIL MEMBRE</span>
          </nav>

          <h1 className="text-display-lg tracking-tight text-primary">{MEMBER_PROFILE.name}</h1>

          <div className="flex flex-wrap items-center gap-md">
            <div className="flex items-center gap-sm rounded-full bg-secondary-container px-md py-xs text-on-secondary-container">
              <Icon name="verified" className="text-[18px]" filled />
              <span className="text-label-md">{MEMBER_PROFILE.role}</span>
            </div>
            <span className="rounded bg-surface-container px-sm py-xs font-mono text-[13px] text-on-surface-variant">
              ID : {MEMBER_PROFILE.memberId}
            </span>
          </div>

          <p className="max-w-[36rem] text-body-lg text-on-surface-variant">{MEMBER_PROFILE.bio}</p>

          <div className="flex flex-wrap gap-md pt-md">
            <button
              type="button"
              className="flex items-center gap-sm rounded-lg bg-primary px-lg py-sm text-label-md text-on-primary transition-opacity hover:opacity-90"
            >
              <Icon name="mail" />
              Contacter le membre
            </button>
            <button
              type="button"
              className="flex items-center gap-sm rounded-lg border border-outline px-lg py-sm text-label-md text-primary transition-colors hover:bg-surface-container-low"
            >
              <Icon name="download" />
              Exporter le CV
            </button>
          </div>
        </div>

        <MembershipCard />
      </section>

      <section className="grid grid-cols-2 gap-md md:grid-cols-4">
        {MEMBER_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-outline-variant bg-surface-container-low p-md"
          >
            <p className="text-label-md text-on-surface-variant">{stat.label}</p>
            <p
              className={cn(
                "text-headline-lg",
                stat.highlight ? "text-secondary" : "text-primary",
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        <div className="space-y-md lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-lg text-primary">Portfolio de projets</h3>
            <div className="flex items-center gap-md">
              <Link
                to="/dashboard/projets/nouveau"
                className="flex items-center gap-xs rounded-lg bg-secondary px-md py-sm text-label-md text-white transition-all hover:opacity-90"
              >
                <Icon name="add" className="text-[16px]" />
                Nouveau projet
              </Link>
              <Link to="#" className="text-label-md text-secondary hover:underline">
                Voir tout sur GitHub
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            {PORTFOLIO_PROJECTS.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={project.image}
                  />
                  <div className="absolute right-sm top-sm flex gap-xs">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white/90 px-sm py-xs text-[10px] font-bold backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-sm p-md">
                  <h4 className="text-headline-md text-primary">{project.title}</h4>
                  <p className="line-clamp-2 text-body-md text-on-surface-variant">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between pt-sm">
                    <div className="flex -space-x-2">
                      {project.team.map((avatar) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={avatar}
                          alt=""
                          className="h-6 w-6 rounded-full border-2 border-white object-cover"
                          src={avatar}
                        />
                      ))}
                    </div>
                    <Link
                      to="#"
                      className="flex items-center gap-xs text-label-md font-bold text-primary"
                    >
                      <Icon name="code" className="text-[18px]" />
                      Voir le code
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-md lg:col-span-4">
          <h3 className="text-headline-lg text-primary">Certifications vérifiées</h3>

          <div className="space-y-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-sm"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded",
                    cert.iconClass,
                  )}
                >
                  <Icon name={cert.icon} className="text-[28px]" filled={cert.filled} />
                </div>
                <div>
                  <h5 className="text-label-md text-primary">{cert.title}</h5>
                  <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">
                    {cert.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-auto text-on-surface-variant transition-colors hover:text-primary"
                  aria-label="Ouvrir la certification"
                >
                  <Icon name="open_in_new" />
                </button>
              </div>
            ))}

            <div className="pt-sm">
              <button
                type="button"
                className="w-full rounded-lg bg-surface-container-highest py-sm text-label-md text-on-surface-variant transition-colors hover:text-primary"
              >
                Voir le relevé officiel
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <p className="mb-md text-label-md text-on-surface-variant">Compétences vérifiées</p>
            <div className="flex flex-wrap gap-xs">
              {COMPETENCIES.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-outline-variant bg-surface-container-lowest px-sm py-xs font-mono text-[13px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center justify-between gap-md border-t border-outline-variant pb-xl pt-xl text-on-surface-variant md:flex-row">
        <div className="flex items-center gap-md">
          <span className="text-label-md">© 2026 RÉSEAU MEMBRES CJP HUB</span>
          <span className="hidden h-1 w-1 rounded-full bg-outline md:block" />
          <span className="text-label-md">VÉRIFICATION ACADÉMIQUE : ACTIVE</span>
        </div>
        <div className="flex gap-lg">
          {SOCIAL_LINKS.map((link) => (
            <Link key={link.label} to={link.href} className="text-label-md hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
