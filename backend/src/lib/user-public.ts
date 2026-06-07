import type { Membership, User } from "@prisma/client";

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  filiere: string;
  niveau: string;
  phone: string;
  role: User["role"];
  membership: {
    status: Membership["status"];
    memberId: string | null;
    academicYear: string;
  } | null;
};

export function toPublicUser(user: User & { membership: Membership | null }): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    matricule: user.matricule,
    filiere: user.filiere,
    niveau: user.niveau,
    phone: user.phone,
    role: user.role,
    membership: user.membership
      ? {
          status: user.membership.status,
          memberId: user.membership.memberId,
          academicYear: user.membership.academicYear,
        }
      : null,
  };
}
