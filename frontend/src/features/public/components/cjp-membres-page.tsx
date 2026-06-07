import { useEffect, useMemo, useState } from "react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { FILIERES, NIVEAUX } from "@/features/public/data/public-data";
import { ApiClientError } from "@/lib/api/client";
import { fetchMembers } from "@/lib/api/members";
import type { ApiMember } from "@/lib/api/types";

export function CjpMembresPage() {
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("Toutes");
  const [niveauFilter, setNiveauFilter] = useState("Tous");

  useEffect(() => {
    let cancelled = false;

    fetchMembers()
      .then(({ members: data }) => {
        if (!cancelled) setMembers(data);
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

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      if (filiereFilter !== "Toutes" && member.filiere !== filiereFilter) return false;
      if (niveauFilter !== "Tous" && member.niveau !== niveauFilter) return false;
      return true;
    });
  }, [members, filiereFilter, niveauFilter]);

  return (
    <CjpPublicLayout variant="light">
      <section className="cjp-container py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <CjpDisplayTitle
              as="h1"
              bold="Membres"
              light="du club"
              lightOnDark={false}
              className="!text-[clamp(2rem,5vw,3.5rem)]"
            />
            <p className="cjp-text-lead mt-4">
              Annuaire des étudiants actifs inscrits au Club des Jeunes Programmeurs.
            </p>
          </div>
          <CjpButton to="/inscription">NOUVELLE ADHÉSION</CjpButton>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <select
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
            className="rounded-lg border border-[var(--cjp-border)] bg-white px-4 py-2 text-sm"
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
            className="rounded-lg border border-[var(--cjp-border)] bg-white px-4 py-2 text-sm"
          >
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {!loading ? (
            <span className="self-center text-sm text-[var(--cjp-text-muted)]">
              {filteredMembers.length} membre{filteredMembers.length > 1 ? "s" : ""} affiché
              {filteredMembers.length > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        {errorMessage ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="cjp-card-light h-32 animate-pulse p-6" />
            ))}
          </div>
        ) : null}

        {!loading && !errorMessage && filteredMembers.length === 0 ? (
          <p className="mt-10 rounded-xl border border-[var(--cjp-border)] bg-white p-8 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucun membre actif ne correspond à ces filtres pour le moment.
          </p>
        ) : null}

        {!loading && filteredMembers.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <article key={member.id} className="cjp-card-light p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--cjp-black)] text-sm font-bold text-[var(--cjp-gold)]">
                    {member.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold">
                      {member.firstName} {member.lastName}
                    </h2>
                    <p className="mt-1 text-sm font-light text-[var(--cjp-text-muted)]">{member.filiere}</p>
                    <p className="text-sm font-light text-[var(--cjp-text-muted)]">Niveau {member.niveau}</p>
                    {member.memberId ? (
                      <p className="mt-1 text-xs text-[var(--cjp-text-muted)]">Carte {member.memberId}</p>
                    ) : null}
                    <span className="cjp-badge-gold mt-3">Membre actif</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </CjpPublicLayout>
  );
}
