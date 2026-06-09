import { apiGet } from "@/lib/api/client";
import type { ApiCertificate, ApiCertificateVerify } from "@/lib/api/types";

export function fetchMyCertificates() {
  return apiGet<{ certificates: ApiCertificate[] }>("/certificates/me", true);
}

export function verifyCertificate(number: string) {
  return apiGet<ApiCertificateVerify>(`/certificates/verify/${encodeURIComponent(number)}`, false);
}
