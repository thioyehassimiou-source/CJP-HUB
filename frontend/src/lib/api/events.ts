import { apiGet, apiPost, getAuthToken } from "@/lib/api/client";
import type { ApiEvent, CreateEventPayload } from "@/lib/api/types";

export function fetchEvents(manage = false) {
  const query = manage ? "?manage=1" : "";
  const auth = manage || Boolean(getAuthToken());
  return apiGet<{ events: ApiEvent[] }>(`/events${query}`, auth);
}

export function createEventRequest(payload: CreateEventPayload) {
  return apiPost<{ event: ApiEvent }>("/events", payload, true);
}

export function registerForEventRequest(eventId: string) {
  return apiPost<{ registered: boolean }>(`/events/${eventId}/register`, {}, true);
}
