import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchEvents, registerForEventRequest } from "@/lib/api/events";
import type { ApiEvent } from "@/lib/api/types";
import { formatEventDate } from "@/lib/catalog-display";
import { cn } from "@/lib/utils";

const DEFAULT_POSTER = "/brand/events/cjp-forum-web.jpg";

export function CjpEvenementsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const loadEvents = () => {
    setLoading(true);
    setErrorMessage("");

    fetchEvents()
      .then(({ events: data }) => setEvents(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les événements",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, [user?.id]);

  const handleRegister = async (eventId: string) => {
    setRegisteringId(eventId);
    setActionMessage("");

    try {
      const response = await registerForEventRequest(eventId);
      setActionMessage("Demande de participation enregistrée. En attente de validation.");
      setEvents((current) =>
        current.map((event) =>
          event.id === eventId
            ? {
                ...event,
                registered: true,
                registrationStatus: response.status,
                registrationCount: event.registrationCount + 1,
                spotsLeft: Math.max(event.spotsLeft - 1, 0),
              }
            : event,
        ),
      );
    } catch (error) {
      setActionMessage(
        error instanceof ApiClientError ? error.message : "Inscription impossible",
      );
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <CjpPublicLayout variant="light">
      <section className="cjp-container py-12 md:py-16">
        <CjpDisplayTitle
          as="h1"
          bold="Événements"
          light="à venir"
          lightOnDark={false}
          className="!text-[clamp(2rem,5vw,3.5rem)]"
        />
        <p className="cjp-text-lead mt-4">
          Hackathons, workshops et conférences tech organisés par le Club des Jeunes Programmeurs.
        </p>

        {errorMessage ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {actionMessage ? (
          <p
            className={cn(
              "mt-8 rounded-lg px-4 py-3 text-sm",
              actionMessage.includes("succès")
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-amber-200 bg-amber-50 text-amber-800",
            )}
          >
            {actionMessage}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-12 space-y-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="cjp-card-light h-56 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && !errorMessage && events.length === 0 ? (
          <p className="mt-12 rounded-xl border border-[var(--cjp-border)] bg-white p-8 text-center text-sm text-[var(--cjp-text-muted)]">
            Aucun événement publié pour le moment.
          </p>
        ) : null}

        {!loading && events.length > 0 ? (
          <div className="mt-12 space-y-8">
            {events.map((event) => (
              <article
                key={event.id}
                className="cjp-card-light flex flex-col overflow-hidden md:flex-row"
              >
                <div className="md:w-2/5">
                  <img
                    src={event.posterUrl ?? DEFAULT_POSTER}
                    alt=""
                    className="h-56 w-full object-cover md:h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="cjp-badge-gold">{event.typeLabel}</span>
                      {event.registrationStatus === "APPROVED" ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
                          Inscrit
                        </span>
                      ) : event.registrationStatus === "PENDING" ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                          En attente
                        </span>
                      ) : null}
                    </div>
                    <p className="cjp-label-gold mt-4">DATE</p>
                    <p className="mt-1 text-lg font-bold">{formatEventDate(event.startAt, event.endAt)}</p>
                    <h2 className="mt-4 text-2xl font-bold">{event.title}</h2>
                    {event.speaker ? (
                      <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">Intervenant : {event.speaker}</p>
                    ) : null}
                    <p className="mt-3 line-clamp-3 font-light leading-relaxed text-[var(--cjp-text-muted)]">
                      {event.description}
                    </p>
                    <p className="mt-4 text-sm text-[var(--cjp-text-muted)]">
                      {event.location ?? "Lieu à confirmer"} · {event.spotsLeft} place
                      {event.spotsLeft > 1 ? "s" : ""} restante{event.spotsLeft > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {!user ? (
                      <CjpButton to="/connexion" className="!py-3 !text-xs">
                        SE CONNECTER POUR S&apos;INSCRIRE
                      </CjpButton>
                    ) : event.registrationStatus === "APPROVED" ? (
                      <span className="cjp-detail-link w-fit cursor-default opacity-70">
                        DÉJÀ INSCRIT
                        <span className="cjp-detail-arrow">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    ) : event.registrationStatus === "PENDING" ? (
                      <span className="cjp-detail-link w-fit cursor-default text-orange-600 opacity-90">
                        EN ATTENTE DE VALIDATION
                      </span>
                    ) : event.spotsLeft === 0 ? (
                      <span className="text-sm font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
                        Complet
                      </span>
                    ) : user.membership?.status !== "ACTIVE" ? (
                      <Link to="/dashboard" className="cjp-detail-link w-fit">
                        ADHÉSION EN ATTENTE
                        <span className="cjp-detail-arrow">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={registeringId === event.id}
                        onClick={() => handleRegister(event.id)}
                        className="cjp-detail-link w-fit disabled:opacity-50"
                      >
                        {registeringId === event.id ? "DEMANDE…" : "Demander une place"}
                        <span className="cjp-detail-arrow">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    )}
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
