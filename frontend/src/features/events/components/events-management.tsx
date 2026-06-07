

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { UPCOMING_EVENTS, type ClubEvent } from "@/features/events/data/events-data";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "calendar";

function RegistrationAvatars({ event }: { event: ClubEvent }) {
  return (
    <div className="flex -space-x-2 justify-end">
      {event.registrationAvatars.map((avatar) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={avatar}
          alt=""
          className="h-8 w-8 rounded-full border-2 border-surface-container-low object-cover"
          src={avatar}
        />
      ))}
      {event.extraRegistrations ? (
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-low text-[10px] font-bold",
            event.extraRegistrationClass ?? "bg-surface-variant text-on-surface",
          )}
        >
          +{event.extraRegistrations}
        </div>
      ) : null}
    </div>
  );
}

function EventListCard({
  event,
  selected,
  onSelect,
}: {
  event: ClubEvent;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-lg rounded-lg border border-outline-variant bg-surface-container-low p-md text-left transition-all hover:border-secondary",
        selected && "border-secondary",
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 flex-col items-center justify-center rounded-lg",
          event.dateHighlight === "primary"
            ? "bg-primary text-on-primary"
            : "bg-surface-container-highest text-on-surface",
        )}
      >
        <span className="text-label-md uppercase opacity-80">{event.month}</span>
        <span className="text-headline-md font-bold">{event.day}</span>
      </div>

      <div className="min-w-0 flex-grow">
        <div className="mb-xs flex items-center gap-sm">
          <span
            className={cn(
              "rounded-full px-sm py-1 text-[10px] font-bold uppercase",
              event.typeClass,
            )}
          >
            {event.typeLabel}
          </span>
          <span className="text-label-md text-on-surface-variant">{event.time}</span>
        </div>
        <h4 className="text-headline-md text-primary">{event.title}</h4>
        <p className="flex items-center gap-xs text-body-md text-on-surface-variant">
          <Icon name="location_on" className="text-[16px]" />
          {event.location}
        </p>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="mb-1 text-label-md text-on-surface-variant">Inscriptions</p>
        <RegistrationAvatars event={event} />
      </div>
    </button>
  );
}

function EventDetailsPanel({ event }: { event: ClubEvent }) {
  return (
    <div className="sticky top-24 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="relative h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={event.title} className="h-full w-full object-cover" src={event.poster} />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 to-transparent p-md">
          <h3 className="text-headline-md text-on-primary">{event.title}</h3>
        </div>
      </div>

      <div className="space-y-md p-lg">
        <div>
          <h4 className="mb-sm text-label-md uppercase tracking-wider text-on-surface-variant">
            Description
          </h4>
          <p className="text-body-md text-on-surface">{event.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-md border-y border-outline-variant py-md">
          <div>
            <p className="mb-xs text-label-md text-on-surface-variant">Capacité</p>
            <p className="text-headline-md font-bold text-secondary">
              {event.registered}/{event.capacity}
            </p>
          </div>
          <div>
            <p className="mb-xs text-label-md text-on-surface-variant">Statut</p>
            <p className={cn("text-headline-md font-bold", event.statusClass)}>{event.status}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-md text-label-md uppercase tracking-wider text-on-surface-variant">
            Participants confirmés
          </h4>
          {event.attendees.length > 0 ? (
            <div className="custom-scrollbar max-h-40 space-y-sm overflow-y-auto">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center gap-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={attendee.name}
                    className="h-8 w-8 rounded-full object-cover"
                    src={attendee.avatar}
                  />
                  <div className="min-w-0 flex-grow">
                    <p className="text-label-md text-primary">{attendee.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{attendee.level}</p>
                  </div>
                  <Icon name="check_circle" className="text-secondary" filled />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              Aucun participant confirmé pour le moment.
            </p>
          )}
        </div>

        <button
          type="button"
          className="w-full rounded-lg border border-primary py-sm text-label-md text-primary transition-colors hover:bg-surface-container-high"
        >
          Gérer la liste des invités
        </button>
      </div>
    </div>
  );
}

export function EventsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedEventId, setSelectedEventId] = useState(UPCOMING_EVENTS[0]?.id ?? "");

  const selectedEvent =
    UPCOMING_EVENTS.find((event) => event.id === selectedEventId) ?? UPCOMING_EVENTS[0];

  return (
    <div className="mx-auto max-w-[1440px]">
      {viewMode === "calendar" ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center shadow-sm">
          <Icon name="calendar_month" className="mx-auto mb-md text-4xl text-outline" />
          <h3 className="text-headline-md text-primary">Vue calendrier</h3>
          <p className="mt-sm text-body-md text-on-surface-variant">
            La vue calendrier sera disponible dans une prochaine version.
          </p>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="mt-lg rounded-lg bg-secondary px-lg py-sm text-label-md text-on-secondary"
          >
            Retour à la liste
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-lg xl:grid-cols-12">
          <div className="space-y-lg xl:col-span-8">
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
              <div className="mb-md flex flex-col justify-between gap-md sm:flex-row sm:items-center">
                <h3 className="text-headline-md text-primary">Événements à venir</h3>
                <div className="flex gap-xs rounded-lg bg-surface-container-low p-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="rounded-md bg-surface-container-lowest px-md py-xs text-label-md shadow-sm"
                  >
                    Liste
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className="rounded-md px-md py-xs text-label-md transition-colors hover:bg-surface-container-high"
                  >
                    Calendrier
                  </button>
                </div>
              </div>

              <div className="space-y-md">
                {UPCOMING_EVENTS.map((event) => (
                  <EventListCard
                    key={event.id}
                    event={event}
                    selected={selectedEvent?.id === event.id}
                    onSelect={() => setSelectedEventId(event.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            {selectedEvent ? <EventDetailsPanel event={selectedEvent} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
