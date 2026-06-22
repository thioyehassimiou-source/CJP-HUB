import { apiGet, apiPost, apiDelete } from "@/lib/api/client";
import type { ApiResource, CreateResourcePayload } from "@/lib/api/types";

export type ResourceFilters = {
  category?: string;
  type?: string;
  level?: string;
  search?: string;
  tags?: string;
};

export function fetchResources(filters: ResourceFilters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.level) queryParams.append("level", filters.level);
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.tags) queryParams.append("tags", filters.tags);

  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
  // Passing true to optionalAuth backend allows fetching isFavorite
  return apiGet<{ resources: ApiResource[] }>(`/resources${queryStr}`, true);
}

export function fetchResourceById(id: string) {
  return apiGet<{ resource: ApiResource }>(`/resources/${id}`, true);
}

export function fetchMyFavoriteResources() {
  return apiGet<{ resources: ApiResource[] }>("/resources/favorites/me", true);
}

export function toggleFavoriteResource(id: string) {
  return apiPost<{ isFavorite: boolean; favoriteCount: number }>(`/resources/${id}/favorite`, {}, true);
}

export function createResourceRequest(payload: CreateResourcePayload) {
  return apiPost<{ resource: ApiResource }>("/resources", payload, true);
}

export function deleteResourceRequest(id: string) {
  return apiDelete(`/resources/${id}`, true);
}

export const RESOURCE_CATEGORIES = [
  "Développement Web",
  "Développement Mobile",
  "Intelligence Artificielle",
  "Cybersécurité",
  "Réseaux",
  "Bases de données",
  "Linux",
  "Git et GitHub",
  "Design UI/UX",
  "Entrepreneuriat",
  "Soft Skills",
] as const;

export const RESOURCE_TYPES = [
  "PDF",
  "COURS",
  "PRESENTATION",
  "VIDEO",
  "TUTORIEL",
  "YOUTUBE",
  "COURSERA",
  "UDEMY",
  "GITHUB",
  "ARTICLE",
  "DOCUMENTATION",
  "EBOOK",
  "COMMUNAUTE",
] as const;

export const RESOURCE_LEVELS = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"] as const;
