import type { Event, Formation } from "@prisma/client";

const EVENT_TYPE_LABELS: Record<Event["type"], string> = {
  FORMATION: "Atelier",
  CONFERENCE: "Conférence",
  HACKATHON: "Hackathon",
  REUNION: "Réunion",
  RECRUTEMENT: "Recrutement",
};

export function toPublicFormation(formation: Formation) {
  return {
    id: formation.id,
    title: formation.title,
    description: formation.description,
    level: formation.level,
    program: formation.program,
    resources: formation.resources,
    published: formation.published,
    createdAt: formation.createdAt.toISOString(),
  };
}

export function toPublicEvent(
  event: Event & { _count?: { registrations: number } },
  options?: { registered?: boolean },
) {
  const registrationCount = event._count?.registrations ?? 0;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.type,
    typeLabel: EVENT_TYPE_LABELS[event.type],
    speaker: event.speaker,
    startAt: event.startAt.toISOString(),
    endAt: event.endAt?.toISOString() ?? null,
    location: event.location,
    meetingLink: event.meetingLink,
    maxPlaces: event.maxPlaces,
    posterUrl: event.posterUrl,
    published: event.published,
    registrationCount,
    spotsLeft: Math.max(event.maxPlaces - registrationCount, 0),
    registered: options?.registered ?? false,
  };
}
