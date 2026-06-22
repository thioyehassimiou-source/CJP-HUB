import { apiGet, apiPatch } from "@/lib/api/client";
import type {
  ApiBureauMember,
  ApiBureauMandate,
  ApiMember,
  ApiPendingMember,
  ValidateMemberAction,
} from "@/lib/api/types";

export function fetchMembers() {
  return apiGet<{ members: ApiMember[] }>("/members", false);
}

export function fetchBureau() {
  return apiGet<{ bureau: ApiBureauMember[] }>("/members/bureau", false);
}

export function fetchAnciensBureaux() {
  return apiGet<{ anciensBureaux: ApiBureauMandate[] }>("/members/anciens-bureaux", false);
}

export function fetchMonHeritage() {
  return apiGet<{ eligible: boolean; legacyBio: string | null }>("/members/mon-heritage", true);
}

export function updateLegacyBio(legacyBio: string) {
  return apiPatch<{ success: boolean; legacyBio: string }>("/members/mon-heritage", { legacyBio }, true);
}

export function fetchPendingMembers() {
  return apiGet<{ pending: ApiPendingMember[] }>("/members/pending", true);
}

export function validateMemberRequest(
  userId: string,
  action: ValidateMemberAction,
  rejectionReason?: string,
) {
  return apiPatch<{ membership: { status: string; memberId?: string; rejectionReason?: string } }>(
    `/members/${userId}/validate`,
    { action, rejectionReason },
    true,
  );
}
