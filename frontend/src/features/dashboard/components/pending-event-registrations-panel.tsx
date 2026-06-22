import { useCallback, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchEvents, validateEventRegistrationRequest } from "@/lib/api/events";
import type { ApiEvent, ApiEventRegistration } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PendingRegistrationRow = {
  eventId: string;
  eventTitle: string;
  registration: ApiEventRegistration;
};

export function PendingEventRegistrationsPanel() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const canManage = user?.role === "ADMINISTRATEUR" || user?.role === "RESPONSABLE";

  const loadPending = useCallback(async () => {
    if (!canManage) {
      setLoading(false);
      return;
    }

    setErrorMessage("");
    try {
      const { events: data } = await fetchEvents(true);
      setEvents(data);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Impossible de charger les inscriptions aux événements",
      );
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const pendingRows = useMemo(() => {
    const rows: PendingRegistrationRow[] = [];
    for (const event of events) {
      if (event.registrations) {
        for (const reg of event.registrations) {
          if (reg.status === "PENDING") {
            rows.push({
              eventId: event.id,
              eventTitle: event.title,
              registration: reg,
            });
          }
        }
      }
    }
    return rows;
  }, [events]);

  const handleValidate = async (eventId: string, userId: string, action: "approve" | "reject") => {
    if (action === "reject") {
      const confirmed = window.confirm("Rejeter cette inscription ?");
      if (!confirmed) return;
    }

    const processKey = `${eventId}-${userId}`;
    setProcessingId(processKey);
    setErrorMessage("");

    try {
      await validateEventRegistrationRequest(eventId, userId, action);
      setEvents((currentEvents) =>
        currentEvents.map((ev) => {
          if (ev.id === eventId && ev.registrations) {
            return {
              ...ev,
              registrations: ev.registrations.map((reg) =>
                reg.userId === userId
                  ? { ...reg, status: action === "approve" ? "APPROVED" : "REJECTED" }
                  : reg
              ),
            };
          }
          return ev;
        })
      );
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Action impossible",
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (!canManage) {
    return null;
  }

  return (
    <div className="cjp-card-dark overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--cjp-border)] p-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--cjp-white)]">Inscriptions aux événements en attente</h3>
          <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
            {loading ? "Chargement…" : `${pendingRows.length} demande${pendingRows.length > 1 ? "s" : ""} à traiter`}
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
              <th className="px-6 py-4">Événement</th>
              <th className="px-6 py-4">Date de demande</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[var(--cjp-text-muted)]">
                  Chargement des inscriptions…
                </td>
              </tr>
            ) : null}

            {!loading && pendingRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[var(--cjp-text-muted)]">
                  Aucune demande d'inscription en attente.
                </td>
              </tr>
            ) : null}

            {!loading
              ? pendingRows.map(({ eventId, eventTitle, registration: row }) => {
                  const processKey = `${eventId}-${row.userId}`;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-[var(--cjp-border)] transition-colors hover:bg-[var(--cjp-gray)]/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-xs font-bold text-[var(--cjp-black)]">
                            {row.user.initials}
                          </span>
                          <div>
                            <p className="font-semibold">
                              {row.user.firstName} {row.user.lastName}
                            </p>
                            <p className="text-xs text-[var(--cjp-text-muted)]">{row.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-light text-[var(--cjp-text-muted)]">
                        {row.user.filiere}
                        <span className="block text-xs">{row.user.niveau}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[var(--cjp-white)]">
                        {eventTitle}
                      </td>
                      <td className="px-6 py-4 font-light text-[var(--cjp-text-muted)]">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={processingId === processKey}
                            onClick={() => handleValidate(eventId, row.userId, "approve")}
                            className={cn(
                              "rounded-full bg-[var(--cjp-gold)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-black)] transition-opacity hover:opacity-90 disabled:opacity-50",
                            )}
                          >
                            Valider
                          </button>
                          <button
                            type="button"
                            disabled={processingId === processKey}
                            onClick={() => handleValidate(eventId, row.userId, "reject")}
                            className="rounded-full border border-[var(--cjp-border)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)] transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
