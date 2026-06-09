import { apiGet, apiPost } from "@/lib/api/client";
import type {
  ApiFormation,
  ApiFormationDetail,
  ApiQuiz,
  ApiQuizResult,
  CreateFormationPayload,
} from "@/lib/api/types";

export function fetchFormations(manage = false) {
  const query = manage ? "?manage=1" : "";
  return apiGet<{ formations: ApiFormation[] }>(`/formations${query}`, manage);
}

export function fetchFormationDetail(formationId: string) {
  return apiGet<{ formation: ApiFormationDetail }>(`/formations/${formationId}`, true);
}

export function fetchFormationQuiz(formationId: string) {
  return apiGet<{ quiz: ApiQuiz }>(`/formations/${formationId}/quiz`, true);
}

export function submitFormationQuiz(formationId: string, answers: Record<string, number>) {
  return apiPost<ApiQuizResult>(`/formations/${formationId}/quiz/submit`, { answers }, true);
}

export function createFormationRequest(payload: CreateFormationPayload) {
  return apiPost<{ formation: ApiFormation }>("/formations", payload, true);
}
