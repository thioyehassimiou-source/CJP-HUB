import { apiGet, apiPost } from "@/lib/api/client";
import type { AuthResponse, AuthUser, StatsOverview } from "@/lib/api/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  matricule: string;
  filiere: string;
  niveau: string;
  phone: string;
};

export function loginRequest(payload: LoginPayload) {
  return apiPost<AuthResponse>("/auth/login", payload, false);
}

export function registerRequest(payload: RegisterPayload) {
  return apiPost<AuthResponse>("/auth/register", payload, false);
}

export function fetchCurrentUser() {
  return apiGet<{ user: AuthUser }>("/auth/me", true);
}

export function fetchStatsOverview() {
  return apiGet<StatsOverview>("/stats/overview", false);
}
