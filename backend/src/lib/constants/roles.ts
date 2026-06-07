import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  MEMBRE: "Membre",
  RESPONSABLE: "Responsable",
  TRESORIER: "Trésorier",
  FORMATEUR: "Formateur",
  ADMINISTRATEUR: "Administrateur",
};
