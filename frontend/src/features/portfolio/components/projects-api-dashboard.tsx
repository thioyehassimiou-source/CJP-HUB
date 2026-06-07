import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CjpButton } from "@/components/cjp/cjp-button";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchProjects } from "@/lib/api/projects";
import type { ApiProject } from "@/lib/api/types";
import { formatFinanceDate } from "@/lib/finance-display";

const DEFAULT_IMAGE = "/brand/events/cjp-digitalis.jpg";

export function ProjectsApiDashboard() {
  const { user } = useAuth();
  const [communityProjects, setCommunityProjects] = useState<ApiProject[]>([]);
  const [myProjects, setMyProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    Promise.all([
      fetchProjects(false),
      user ? fetchProjects(true) : Promise.resolve({ projects: [] }),
    ])
      .then(([community, mine]) => {
        setCommunityProjects(community.projects);
        setMyProjects(mine.projects);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les projets",
        );
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const projectCount = useMemo(() => myProjects.length, [myProjects]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="cjp-card-dark h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
        {errorMessage}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="cjp-card-dark flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="cjp-label-gold">Mon portfolio</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--cjp-white)]">
            {user ? `${user.firstName} ${user.lastName}` : "Membre CJP"}
          </h2>
          <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">
            {projectCount} projet{projectCount > 1 ? "s" : ""} publié{projectCount > 1 ? "s" : ""}
            {user?.membership?.memberId ? ` · Carte ${user.membership.memberId}` : ""}
          </p>
        </div>
        <CjpButton to="/dashboard/projets/nouveau">NOUVEAU PROJET</CjpButton>
      </div>

      {myProjects.length > 0 ? (
        <section>
          <h3 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">Mes projets</h3>
          <ProjectGrid projects={myProjects} />
        </section>
      ) : null}

      <section>
        <h3 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">Projets de la communauté</h3>
        {communityProjects.length === 0 ? (
          <p className="cjp-card-dark p-8 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucun projet publié pour le moment.
          </p>
        ) : (
          <ProjectGrid projects={communityProjects} />
        )}
      </section>
    </div>
  );
}

function ProjectGrid({ projects }: { projects: ApiProject[] }) {
  return (
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
                className="cjp-detail-link w-fit"
              >
                VOIR SUR GITHUB
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
