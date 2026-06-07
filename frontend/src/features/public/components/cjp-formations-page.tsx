import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { ApiClientError } from "@/lib/api/client";
import { fetchFormations } from "@/lib/api/formations";
import type { ApiFormation } from "@/lib/api/types";
import { getFormationImage } from "@/lib/catalog-display";

export function CjpFormationsPage() {
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchFormations()
      .then(({ formations: data }) => {
        if (!cancelled) setFormations(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiClientError ? error.message : "Impossible de charger les formations",
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

  return (
    <CjpPublicLayout variant="light">
      <section className="cjp-container py-12 md:py-16">
        <CjpDisplayTitle
          as="h1"
          bold="Formations"
          light="certifiantes du CJP"
          lightOnDark={false}
          className="!text-[clamp(2rem,5vw,3.5rem)]"
        />
        <p className="cjp-text-lead mt-4">
          Parcours encadrés par des mentors du campus — Web, Mobile, IA et Cybersécurité.
        </p>

        {errorMessage ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="cjp-card-dark h-96 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && !errorMessage && formations.length === 0 ? (
          <p className="mt-12 rounded-xl border border-[var(--cjp-border)] bg-white p-8 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucune formation publiée pour le moment.
          </p>
        ) : null}

        {!loading && formations.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {formations.map((formation) => (
              <article key={formation.id} className="cjp-card-dark overflow-hidden">
                <div className="relative h-44 overflow-hidden grayscale">
                  <img
                    src={getFormationImage(formation.program)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--cjp-black)] to-transparent p-4">
                    <p className="text-sm font-bold text-[var(--cjp-gold)]">{formation.program}</p>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <h2 className="text-xl font-bold text-[var(--cjp-gold)]">{formation.title}</h2>
                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-[var(--cjp-text-muted)]">
                    {formation.description}
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="cjp-label-gold">NIVEAU</dt>
                      <dd className="font-light text-[var(--cjp-text-muted)]">{formation.level}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="cjp-label-gold">PROGRAMME</dt>
                      <dd className="font-light text-[var(--cjp-text-muted)]">{formation.program}</dd>
                    </div>
                  </dl>
                  <Link to="/inscription" className="cjp-detail-link !text-[var(--cjp-gold)]">
                    REJOINDRE LE CLUB
                    <span className="cjp-detail-arrow !bg-[var(--cjp-gold)] !text-[var(--cjp-black)]">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </CjpPublicLayout>
  );
}
