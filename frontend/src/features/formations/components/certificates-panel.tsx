import { useEffect, useState } from "react";
import { Award, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import { fetchMyCertificates } from "@/lib/api/certificates";
import { ApiClientError } from "@/lib/api/client";
import type { ApiCertificate } from "@/lib/api/types";
import { exportCertificateToPDF } from "@/features/doc-gen/components/certificate-pdf-exporter";

function DownloadCertificateButton({ certificate }: { certificate: ApiCertificate }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await exportCertificateToPDF({
        memberName: certificate.holderName,
        training: certificate.formationTitle,
        issueDate: certificate.issuedAt,
        certificateNumber: `REF: #${certificate.number}`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="mt-3 ml-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] hover:underline disabled:opacity-50"
    >
      {loading ? <span className="animate-spin">⏳</span> : <Download className="h-3 w-3" />}
      {loading ? "Génération..." : "PDF"}
    </button>
  );
}


export function CertificatesPanel() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<ApiCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetchMyCertificates()
      .then(({ certificates: data }) => setCertificates(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les certificats",
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="cjp-label-gold">Portfolio académique</p>
        <h2 className="text-xl font-bold text-[var(--cjp-white)]">Mes certificats</h2>
      </div>

      {loading ? <div className="cjp-card-dark h-28 animate-pulse" /> : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      {!loading && certificates.length === 0 ? (
        <p className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
          Aucun certificat pour le moment. Passez un quiz de formation pour en obtenir un.
        </p>
      ) : null}

      {!loading && certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <article key={certificate.id} className="cjp-card-dark p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-[var(--cjp-gold)]">
                    {certificate.number}
                  </p>
                  <h3 className="mt-1 font-semibold text-[var(--cjp-white)]">
                    {certificate.formationTitle}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--cjp-text-muted)]">
                    {certificate.formationProgram} · {certificate.formationLevel}
                  </p>
                  <Link
                    to={`/certificats/verify/${certificate.number}`}
                    className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] hover:underline"
                  >
                    Vérifier
                  </Link>
                  <DownloadCertificateButton certificate={certificate} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
