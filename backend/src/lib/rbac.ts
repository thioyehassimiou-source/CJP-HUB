import { Role } from "@prisma/client";

const ROLE_HIERARCHY: Record<Role, number> = {
  MEMBRE: 1,
  FORMATEUR: 2,
  TRESORIER: 3,
  RESPONSABLE: 4,
  ADMINISTRATEUR: 5,
};

export function hasMinRole(userRole: Role, requiredRole: Role) {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const PERMISSIONS = {
  manageMembers: [Role.RESPONSABLE, Role.ADMINISTRATEUR] as Role[],
  manageFinance: [Role.TRESORIER, Role.ADMINISTRATEUR] as Role[],
  viewFinanceDetails: [Role.TRESORIER, Role.RESPONSABLE, Role.ADMINISTRATEUR] as Role[],
  manageFormations: [Role.FORMATEUR, Role.ADMINISTRATEUR] as Role[],
  manageEvents: [Role.RESPONSABLE, Role.ADMINISTRATEUR] as Role[],
};

export function canAccess(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}
