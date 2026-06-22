import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { ApiClientError } from "@/lib/api/client";
import { fetchProjects } from "@/lib/api/projects";
import type { ApiProject } from "@/lib/api/types";
import { formatFinanceDate } from "@/lib/finance-display";

const DEFAULT_IMAGE = "/brand/events/cjp-digitalis.jpg";

export function CjpProjetsPage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    fetchProjects(false)
      .then(({ projects: data }) => setProjects(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les projets",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CjpPublicLayout variant="dark">
      <section className="cjp-container py-12 md:py-16">
        <CjpDisplayTitle
          as="h1"
          bold="Projets"
          light=" de la communauté"
          lightOnDark={true}
          className="!text-[clamp(2rem,5vw,3.5rem)]"
        />
        <p className="cjp-text-lead mt-4 mb-12">
          Découvrez les réalisations techniques et les projets open-source des membres du club.
        </p>

        {errorMessage ? (
          <p className="mb-8 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="cjp-card-dark h-56 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && projects.length === 0 && !errorMessage ? (
          <p className="cjp-card-dark p-8 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucun projet publié pour le moment.
          </p>
        ) : null}

        {!loading && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="cjp-card-dark overflow-hidden">
                <div className="relative h-44">
                  <img
                    src={DEFAULT_IMAGE}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="cjp-badge-gold">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="absolute right-4 top-4 rounded-full bg-[var(--cjp-black)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
                    {project.statusLabel}
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h4 className="text-xl font-bold text-[var(--cjp-white)]">{project.title}</h4>
                    <p className="mt-2 line-clamp-3 text-sm text-[var(--cjp-text-muted)]">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs text-[var(--cjp-text-muted)]">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member) => (
                        <span
                          key={member.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cjp-border)] bg-[var(--cjp-gold)] text-[10px] font-bold text-[var(--cjp-black)]"
                          title={`${member.firstName} ${member.lastName}`}
                        >
                          {member.initials}
                        </span>
                      ))}
                    </div>
                    <span>{formatFinanceDate(project.createdAt)}</span>
                  </div>
                  {project.githubUrl ? (
                    <Link
                      to={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cjp-detail-link w-fit !text-[var(--cjp-gold)] hover:underline"
                    >
                      VOIR SUR GITHUB
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </CjpPublicLayout>
  );
}
