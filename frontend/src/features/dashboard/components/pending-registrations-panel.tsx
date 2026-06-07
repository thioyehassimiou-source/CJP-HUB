import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchPendingMembers, validateMemberRequest } from "@/lib/api/members";
import type { ApiPendingMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PendingRegistrationsPanel() {
  const { user } = useAuth();
  const [pending, setPending] = useState<ApiPendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const canManage =
    user?.role === "ADMINISTRATEUR" || user?.role === "RESPONSABLE";

  const loadPending = useCallback(async () => {
    if (!canManage) {
      setLoading(false);
      return;
    }

    setErrorMessage("");
    try {
      const { pending: data } = await fetchPendingMembers();
      setPending(data);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Impossible de charger les candidatures",
      );
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleValidate = async (memberId: string, action: "approve" | "reject") => {
    if (action === "reject") {
      const confirmed = window.confirm("Rejeter cette candidature ?");
      if (!confirmed) return;
    }

    setProcessingId(memberId);
    setErrorMessage("");

    try {
      await validateMemberRequest(memberId, action);
      setPending((current) => current.filter((member) => member.id !== memberId));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Action impossible",
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (!canManage) {
    return (
      <div className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
        Connectez-vous avec un compte bureau pour valider les inscriptions en attente.
      </div>
    );
  }

  return (
    <div className="cjp-card-dark overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--cjp-border)] p-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--cjp-white)]">Inscriptions en attente</h3>
          <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
            {loading ? "Chargement…" : `${pending.length} candidature${pending.length > 1 ? "s" : ""} à traiter`}
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="border-b border-[var(--cjp-border)] px-6 py-4 text-sm text-red-400">{errorMessage}</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--cjp-border)] text-[10px] uppercase tracking-wider text-[var(--cjp-text-muted)]">
              <th className="px-6 py-4">Membre</th>
              <th className="px-6 py-4">Filière</th>
              <th className="px-6 py-4">Matricule</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[var(--cjp-text-muted)]">
                  Chargement des candidatures…
                </td>
              </tr>
            ) : null}

            {!loading && pending.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[var(--cjp-text-muted)]">
                  Aucune inscription en attente pour le moment.
                </td>
              </tr>
            ) : null}

            {!loading
              ? pending.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--cjp-border)] transition-colors hover:bg-[var(--cjp-gray)]/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-xs font-bold text-[var(--cjp-black)]">
                          {row.initials}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {row.firstName} {row.lastName}
                          </p>
                          <p className="text-xs text-[var(--cjp-text-muted)]">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-light text-[var(--cjp-text-muted)]">
                      {row.filiere}
                      <span className="block text-xs">{row.niveau}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[var(--cjp-text-muted)]">
                      {row.matricule}
                    </td>
                    <td className="px-6 py-4 font-light text-[var(--cjp-text-muted)]">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={processingId === row.id}
                          onClick={() => handleValidate(row.id, "approve")}
                          className={cn(
                            "rounded-full bg-[var(--cjp-gold)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-black)] transition-opacity hover:opacity-90 disabled:opacity-50",
                          )}
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          disabled={processingId === row.id}
                          onClick={() => handleValidate(row.id, "reject")}
                          className="rounded-full border border-[var(--cjp-border)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)] transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
