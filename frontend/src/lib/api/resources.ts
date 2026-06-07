import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResource, CreateResourcePayload } from "@/lib/api/types";

export function fetchResources(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiGet<{ resources: ApiResource[] }>(`/resources${query}`, false);
}

export function createResourceRequest(payload: CreateResourcePayload) {
  return apiPost<{ resource: ApiResource }>("/resources", payload, true);
}

export const RESOURCE_CATEGORIES = [
  "Web",
  "Mobile",
  "IA",
  "Administration",
  "Cybersécurité",
  "Général",
] as const;
