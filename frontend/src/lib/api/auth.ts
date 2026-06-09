import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
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

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export function updateProfileRequest(payload: UpdateProfilePayload) {
  return apiPatch<{ user: AuthUser }>("/auth/me", payload, true);
}

export function updatePasswordRequest(payload: UpdatePasswordPayload) {
  return apiPatch<{ ok: boolean }>("/auth/password", payload, true);
}
