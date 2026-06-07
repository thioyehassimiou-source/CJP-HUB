import { apiGet, apiPost, getAuthToken } from "@/lib/api/client";
import type { ApiProject, CreateProjectPayload } from "@/lib/api/types";

export function fetchProjects(mine = false) {
  const query = mine ? "?mine=1" : "";
  const auth = mine || Boolean(getAuthToken());
  return apiGet<{ projects: ApiProject[] }>(`/projects${query}`, auth);
}

export function createProjectRequest(payload: CreateProjectPayload) {
  return apiPost<{ project: ApiProject }>("/projects", payload, true);
}
