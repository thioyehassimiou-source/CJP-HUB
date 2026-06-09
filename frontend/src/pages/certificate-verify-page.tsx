import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Award, ShieldCheck, ShieldX } from "lucide-react";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { verifyCertificate } from "@/lib/api/certificates";
import { ApiClientError } from "@/lib/api/client";
import type { ApiCertificateVerify } from "@/lib/api/types";

export function CertificateVerifyPage() {
  const { number: routeNumber } = useParams<{ number?: string }>();
  const [query, setQuery] = useState(routeNumber ?? "");
  const [result, setResult] = useState<ApiCertificateVerify | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const runVerify = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMessage("");
    verifyCertificate(trimmed)
      .then(setResult)
      .catch((error) => {
        setResult(null);
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Vérification impossible",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (routeNumber) {
      runVerify(routeNumber);
    }
  }, [routeNumber]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runVerify(query);
  };

  return (
    <CjpPublicLayout variant="dark">
      <section className="cjp-container py-16 md:py-20">
        <CjpDisplayTitle bold="Vérifier" light=" un certificat" />
        <p className="mt-4 cjp-text-lead">
          Saisissez le numéro du certificat CJP pour confirmer son authenticité.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            placeholder="CJP-CERT-2026-0001"
            className="flex-1 rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 font-mono text-sm text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
          />
          <button type="submit" disabled={loading} className="btn-cjp !py-3 !text-xs">
            {loading ? "Vérification…" : "Vérifier"}
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-6 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {result ? (
          <div className="mt-8 max-w-2xl">
            {"valid" in result && result.valid === false ? (
              <div className="cjp-card-dark flex items-start gap-4 border border-red-400/30 p-6">
                <ShieldX className="h-8 w-8 shrink-0 text-red-400" />
                <div>
                  <h2 className="text-lg font-bold text-[var(--cjp-white)]">Certificat introuvable</h2>
                  <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">{result.message}</p>
                  <p className="mt-2 font-mono text-xs text-[var(--cjp-text-muted)]">{result.number}</p>
                </div>
              </div>
            ) : (
              <div className="cjp-card-dark flex items-start gap-4 border border-[var(--cjp-gold)]/30 p-6">
                <ShieldCheck className="h-8 w-8 shrink-0 text-[var(--cjp-gold)]" />
                <div>
                  <p className="cjp-label-gold">Certificat authentique</p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--cjp-white)]">{result.number}</h2>
                  <div className="mt-4 space-y-2 text-sm text-[var(--cjp-text-muted)]">
                    <p>
                      <span className="text-[var(--cjp-white)]">{result.holderName}</span> ·{" "}
                      {result.matricule}
                    </p>
                    <p>{result.formationTitle}</p>
                    <p>{result.formationProgram}</p>
                    <p>
                      Délivré le{" "}
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(result.issuedAt))}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-[var(--cjp-gold)]">
                    <Award className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Vérifié CJP Hub</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </CjpPublicLayout>
  );
}
