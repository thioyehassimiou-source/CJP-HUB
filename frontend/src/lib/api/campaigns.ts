import { apiGet, apiPost } from "./client";

export type Campaign = {
  id: string;
  name: string;
  requiredScans: number;
  status: string;
  formation: { title: string } | null;
  event: { title: string } | null;
};

export type CampaignLink = {
  id: string;
  token: string;
  dayNumber: number;
  isActive: boolean;
};

export type CampaignParticipant = {
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  scannedDays: string;
  scanCount: number;
  claimed: boolean;
  createdAt: string;
};

export function createCampaign(data: { name: string; formationId?: string; eventId?: string; requiredScans: number }) {
  return apiPost<{ campaign: Campaign }>("/campaigns", data, true);
}

export function fetchCampaigns() {
  return apiGet<{ campaigns: (Campaign & { _count: { participants: number } })[] }>("/campaigns", true);
}

export function fetchCampaignDetails(id: string) {
  return apiGet<{ campaign: Campaign & { scannerLinks: CampaignLink[] }; participants: CampaignParticipant[] }>(
    `/campaigns/${id}/details`,
    true,
  );
}

export function fetchOpenCampaigns() {
  return apiGet<{ campaigns: Campaign[] }>("/campaigns/open", false);
}

export function scanPass(token: string, phoneNumber: string) {
  return apiPost<{ success: boolean; message: string; participant: { phoneNumber: string } }>(
    "/campaigns/scan",
    { token, phoneNumber },
    false, // No auth required for the scanner (uses the secret token)
  );
}

export function claimCertificate(data: {
  campaignId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  return apiPost<{ success: boolean; participant: any; campaign: any }>("/campaigns/claim", data, false);
}
