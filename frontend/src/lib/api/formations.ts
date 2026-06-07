import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiFormation, CreateFormationPayload } from "@/lib/api/types";

export function fetchFormations(manage = false) {
  const query = manage ? "?manage=1" : "";
  return apiGet<{ formations: ApiFormation[] }>(`/formations${query}`, manage);
}

export function createFormationRequest(payload: CreateFormationPayload) {
  return apiPost<{ formation: ApiFormation }>("/formations", payload, true);
}
