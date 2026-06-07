const FORMATION_IMAGES: Record<string, string> = {
  Web: "/brand/events/cjp-forum-web.jpg",
  Sécurité: "/brand/events/cjp-digitalis.jpg",
  Data: "/brand/events/cjp-forum-audience.jpg",
};

export function getFormationImage(program: string) {
  return FORMATION_IMAGES[program] ?? "/brand/events/cjp-digitalis.jpg";
}

export function formatEventDate(startAt: string, endAt: string | null) {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  const date = start.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = start.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!end) {
    return `${date} · ${startTime}`;
  }

  const endTime = end.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} · ${startTime} — ${endTime}`;
}

export function formatPublishedDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const EVENT_TYPE_OPTIONS = [
  { value: "FORMATION", label: "Atelier / Formation" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "CONFERENCE", label: "Conférence" },
  { value: "REUNION", label: "Réunion" },
  { value: "RECRUTEMENT", label: "Recrutement" },
] as const;

export const FORMATION_PROGRAMS = ["Web", "Mobile", "Sécurité", "Data", "IA", "Backend"] as const;

export const FORMATION_LEVELS = ["Débutant", "Intermédiaire", "Avancé"] as const;
