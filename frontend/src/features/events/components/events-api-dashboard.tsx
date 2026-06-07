import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchEvents } from "@/lib/api/events";
import type { ApiEvent } from "@/lib/api/types";
import { formatEventDate } from "@/lib/catalog-display";

const DEFAULT_POSTER = "/brand/events/cjp-forum-web.jpg";

export function EventsApiDashboard() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMINISTRATEUR" || user?.role === "RESPONSABLE";
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchEvents(canManage)
      .then(({ events: data }) => setEvents(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les événements",
        );
      })
      .finally(() => setLoading(false));
  }, [canManage]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="cjp-card-dark h-32 animate-pulse" />
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

  if (events.length === 0) {
    return (
      <p className="cjp-card-dark p-8 text-center text-sm text-[var(--cjp-text-muted)]">
        Aucun événement enregistré pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <article key={event.id} className="cjp-card-dark flex flex-col gap-4 p-6 md:flex-row">
          <img
            src={event.posterUrl ?? DEFAULT_POSTER}
            alt=""
            className="h-32 w-full rounded-lg object-cover md:w-48"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="cjp-badge-gold">{event.typeLabel}</span>
              {!event.published ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
                  Brouillon
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-xl font-bold text-[var(--cjp-white)]">{event.title}</h3>
            <p className="mt-2 text-sm text-[var(--cjp-gold)]">{formatEventDate(event.startAt, event.endAt)}</p>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--cjp-text-muted)]">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-wider text-[var(--cjp-text-muted)]">
              <span>{event.location ?? "Lieu à confirmer"}</span>
              <span>
                {event.registrationCount}/{event.maxPlaces} inscrits
              </span>
              {event.registered ? <span className="text-[var(--cjp-gold)]">Vous êtes inscrit</span> : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
