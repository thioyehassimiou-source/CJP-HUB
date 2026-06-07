import type { UserRole } from "@/lib/api/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  MEMBRE: "Membre",
  FORMATEUR: "Formateur",
  TRESORIER: "Trésorier",
  RESPONSABLE: "Responsable",
  ADMINISTRATEUR: "Administrateur",
};

export function canManageMembers(role?: UserRole) {
  return role === "ADMINISTRATEUR" || role === "RESPONSABLE";
}

export function canManageFinance(role?: UserRole) {
  return role === "ADMINISTRATEUR" || role === "TRESORIER";
}

export function canManageFormations(role?: UserRole) {
  return role === "ADMINISTRATEUR" || role === "FORMATEUR";
}

export function canManageEvents(role?: UserRole) {
  return role === "ADMINISTRATEUR" || role === "RESPONSABLE";
}

export function hasRole(role: UserRole | undefined, allowed: UserRole[]) {
  return role ? allowed.includes(role) : false;
}
