import { apiGet, apiPatch } from "@/lib/api/client";
import type { ApiMember, ApiPendingMember, ValidateMemberAction } from "@/lib/api/types";

export function fetchMembers() {
  return apiGet<{ members: ApiMember[] }>("/members", false);
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
