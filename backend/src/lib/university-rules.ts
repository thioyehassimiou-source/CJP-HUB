/** Licences fondamentales — Université de Labé (univ-labe.edu.gn) */
export const UNIVERSITE_LABE_FILIERES = [
  "Mathématiques",
  "Informatique",
  "MIAGE",
  "Biologie",
  "Economie Statistique Appliquée",
  "Chimie et Environnement",
  "Photovoltaïque",
  "Langue Arabe",
  "Langue Anglaise",
  "Lettres Modernes",
  "Sociologie",
  "Administration Publique",
  "Économie",
  "Économie Sociale et Solidaire",
  "Gestion",
] as const;

export const UNIVERSITE_LABE_NIVEAUX = ["L1", "L2", "L3"] as const;

export const MATRICULE_PATTERN = /^[A-Z]{4}\d{10}$/;

export const GMAIL_EMAIL_PATTERN = /^[^\s@]+@gmail\.com$/;

export function normalizeMatricule(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeGmailEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateRegistrationFields(input: {
  matricule: string;
  email: string;
  filiere: string;
  niveau: string;
}) {
  const matricule = normalizeMatricule(input.matricule);

  if (!MATRICULE_PATTERN.test(matricule)) {
    throw new Error(
      "Le matricule doit contenir 4 lettres majuscules suivies de 10 chiffres (ex. THHA1512131516)",
    );
  }

  const email = normalizeGmailEmail(input.email);

  if (!GMAIL_EMAIL_PATTERN.test(email)) {
    throw new Error("L'e-mail doit se terminer par @gmail.com");
  }

  if (!UNIVERSITE_LABE_FILIERES.includes(input.filiere as (typeof UNIVERSITE_LABE_FILIERES)[number])) {
    throw new Error("Filière non reconnue à l'Université de Labé");
  }

  if (!UNIVERSITE_LABE_NIVEAUX.includes(input.niveau as (typeof UNIVERSITE_LABE_NIVEAUX)[number])) {
    throw new Error("Seuls les niveaux de licence L1, L2 et L3 sont acceptés");
  }

  return { matricule, email };
}
