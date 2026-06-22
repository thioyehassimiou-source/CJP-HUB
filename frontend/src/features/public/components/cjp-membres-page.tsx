import { useEffect, useMemo, useRef, useState } from "react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import { CjpParticles } from "@/components/cjp/cjp-particles";
import { useAuth } from "@/features/auth/auth-context";
import { FILIERES, NIVEAUX } from "@/features/public/data/public-data";
import { ApiClientError } from "@/lib/api/client";
import { fetchMembers, fetchBureau } from "@/lib/api/members";
import type { ApiMember, ApiBureauMember } from "@/lib/api/types";

export function CjpMembresPage() {
  const { user } = useAuth();
  const [bureau, setBureau] = useState<ApiBureauMember[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("Toutes");
  const [niveauFilter, setNiveauFilter] = useState("Tous");
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchBureau(), fetchMembers()])
      .then(([bureauData, membersData]) => {
        if (!cancelled) {
          setBureau(bureauData.bureau);
          // Filter out bureau members from the general members list
          const bureauIds = new Set(bureauData.bureau.map(b => b.id));
          setMembers(membersData.members.filter(m => !bureauIds.has(m.id)));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiClientError ? error.message : "Impossible de charger l'annuaire",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBureau = useMemo(() => {
    return bureau.filter((member) => {
      if (filiereFilter !== "Toutes" && member.filiere !== filiereFilter) return false;
      return true;
    });
  }, [bureau, filiereFilter]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      if (filiereFilter !== "Toutes" && member.filiere !== filiereFilter) return false;
      if (niveauFilter !== "Tous" && member.niveau !== niveauFilter) return false;
      return true;
    });
  }, [members, filiereFilter, niveauFilter]);

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
        className="relative overflow-hidden min-h-screen py-16 md:py-20"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(245,166,35,0.12),transparent_55%)] transition-transform duration-300 ease-out"
          aria-hidden
        />
        <CjpParticles count={25} />
        
        <div className="cjp-container relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <CjpReveal>
              <p className="cjp-label-gold mb-4">Annuaire du CJP</p>
              <CjpDisplayTitle
                as="h1"
                bold="Membres"
                light="du club"
                className="!text-[clamp(2rem,5vw,3.5rem)]"
              />
              <p className="cjp-text-lead mt-4 max-w-2xl">
                Découvrez le bureau exécutif et les étudiants actifs du Club des Jeunes Programmeurs.
              </p>
            </CjpReveal>
            <CjpReveal delay={150}>
              <CjpButton to="/inscription">NOUVELLE ADHÉSION</CjpButton>
            </CjpReveal>
          </div>

          <CjpReveal delay={200}>
            <div className="mt-12 flex flex-wrap gap-4 items-center rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-black)]/50 p-4 backdrop-blur-sm">
              {user ? (
                <>
                  <select
                    value={filiereFilter}
                    onChange={(e) => setFiliereFilter(e.target.value)}
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-dark)] px-4 py-2 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
                  >
                    {FILIERES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <select
                    value={niveauFilter}
                    onChange={(e) => setNiveauFilter(e.target.value)}
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-dark)] px-4 py-2 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
                  >
                    {NIVEAUX.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <p className="text-sm text-[var(--cjp-text-muted)] italic">
                  Connectez-vous pour filtrer l'annuaire par filière ou par niveau.
                </p>
              )}

              {!loading ? (
                <span className="ml-auto self-center text-sm font-semibold text-[var(--cjp-gold)]">
                  {filteredBureau.length + filteredMembers.length} membre{filteredBureau.length + filteredMembers.length > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>
          </CjpReveal>

          {errorMessage ? (
            <p className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </p>
          ) : null}

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="cjp-card-dark h-32 animate-pulse p-6" />
              ))}
            </div>
          ) : null}

          {!loading && !errorMessage && filteredBureau.length === 0 && filteredMembers.length === 0 ? (
            <CjpReveal delay={300}>
              <p className="mt-10 rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-dark)]/50 p-8 text-center text-sm text-[var(--cjp-text-muted)]">
                Aucun membre actif ne correspond à ces filtres pour le moment.
              </p>
            </CjpReveal>
          ) : null}

          {!loading && filteredBureau.length > 0 ? (
            <div className="mt-12">
              <CjpReveal>
                <h2 className="mb-6 text-2xl font-bold text-[var(--cjp-white)]">Bureau Exécutif</h2>
              </CjpReveal>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBureau.map((member, index) => (
                  <CjpReveal key={member.id} delay={(index % 6) * 100}>
                    <article className="cjp-card-dark group h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-12px_rgba(245,166,35,0.25)] border-[var(--cjp-gold)]/20">
                      {/* Ruban décoratif (optionnel, pour correspondre à l'image) */}
                      <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden rounded-tr-xl">
                        <div className="absolute top-0 right-0 h-2 w-10 bg-[var(--cjp-gold)] transform translate-x-2 -translate-y-1 rotate-45 origin-bottom-left" />
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--cjp-gold)]/40 bg-gradient-to-br from-[var(--cjp-dark)] via-[var(--cjp-black)] to-[var(--cjp-dark)] shadow-[0_0_15px_rgba(245,166,35,0.1)] transition-all duration-300 group-hover:border-[var(--cjp-gold)] group-hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]">
                          <span className="text-lg font-bold text-[var(--cjp-gold)] transition-transform duration-500 group-hover:scale-110">
                            {member.initials}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-lg font-bold text-[var(--cjp-white)] transition-colors group-hover:text-[var(--cjp-gold)]">
                            {member.firstName} {member.lastName}
                          </h2>
                          <p className="mt-1 text-sm font-semibold text-[var(--cjp-gold)]">
                            {member.bureauTitle || member.role}
                          </p>
                          <p className="mt-1 text-sm font-light text-[var(--cjp-text-muted)]">{member.filiere}</p>
                          {member.bio ? (
                            <p className="mt-2 text-xs font-light text-[var(--cjp-text-muted)] line-clamp-2">
                              {member.bio}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </CjpReveal>
                ))}
              </div>
            </div>
          ) : null}

          {!loading && filteredMembers.length > 0 ? (
            <div className="mt-12">
              <CjpReveal>
                <h2 className="mb-6 text-2xl font-bold text-[var(--cjp-white)]">Membres du club</h2>
              </CjpReveal>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member, index) => (
                  <CjpReveal key={member.id} delay={(index % 6) * 100}>
                    <article className="cjp-card-dark group h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-12px_rgba(245,166,35,0.25)]">
                      <div className="flex items-start gap-4">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--cjp-border)] bg-gradient-to-br from-[var(--cjp-dark)] via-[var(--cjp-black)] to-[var(--cjp-dark)] transition-all duration-300 group-hover:border-[var(--cjp-gold)]/40 group-hover:shadow-[0_0_15px_rgba(245,166,35,0.2)]">
                          <span className="text-lg font-bold text-[var(--cjp-gold)] transition-transform duration-500 group-hover:scale-110">
                            {member.initials}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-lg font-bold text-[var(--cjp-white)] transition-colors group-hover:text-[var(--cjp-gold)]">
                            {member.firstName} {member.lastName}
                          </h2>
                          <p className="mt-1 text-sm font-light text-[var(--cjp-text-muted)]">{member.filiere}</p>
                          <p className="text-sm font-light text-[var(--cjp-text-muted)]">Niveau {member.niveau}</p>
                          {member.memberId ? (
                            <p className="mt-2 text-xs font-mono text-[var(--cjp-text-muted)]/60">Carte N° {member.memberId}</p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </CjpReveal>
                ))}
              </div>
            </div>
          ) : null}

        </div>
      </section>
    </CjpPublicLayout>
  );
}

