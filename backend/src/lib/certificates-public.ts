import type { Certificate, Formation, User } from "@prisma/client";

export function toPublicCertificate(
  certificate: Certificate & {
    formation: Pick<Formation, "id" | "title" | "program" | "level">;
    user: Pick<User, "firstName" | "lastName" | "matricule">;
  },
) {
  return {
    id: certificate.id,
    number: certificate.number,
    formationId: certificate.formationId,
    formationTitle: certificate.formation.title,
    formationProgram: certificate.formation.program,
    formationLevel: certificate.formation.level,
    holderName: `${certificate.user.firstName} ${certificate.user.lastName}`,
    matricule: certificate.user.matricule,
    issuedAt: certificate.issuedAt.toISOString(),
    verified: certificate.verified,
  };
}

export function toVerifyCertificate(
  certificate: Certificate & {
    formation: Pick<Formation, "title" | "program" | "level">;
    user: Pick<User, "firstName" | "lastName" | "matricule">;
  },
) {
  return {
    valid: certificate.verified,
    number: certificate.number,
    holderName: `${certificate.user.firstName} ${certificate.user.lastName}`,
    matricule: certificate.user.matricule,
    formationTitle: certificate.formation.title,
    formationProgram: certificate.formation.program,
    issuedAt: certificate.issuedAt.toISOString(),
  };
}
