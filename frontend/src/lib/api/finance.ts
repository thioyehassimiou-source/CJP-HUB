import { apiGet, apiPost } from "@/lib/api/client";
import type {
  ApiCotisation,
  ApiFinanceTransaction,
  CreateFinanceTransactionPayload,
  FinanceSummary,
  PayCotisationPayload,
} from "@/lib/api/types";

export function fetchFinanceSummary() {
  return apiGet<FinanceSummary>("/finance/summary", true);
}

export function fetchFinanceTransactions() {
  return apiGet<{ transactions: ApiFinanceTransaction[] }>("/finance/transactions", true);
}

export function fetchMyCotisation() {
  return apiGet<{
    cotisation: ApiCotisation | null;
    academicYear: string;
    defaultAmount: number;
  }>("/finance/cotisations/me", true);
}

export function createFinanceTransaction(payload: CreateFinanceTransactionPayload) {
  return apiPost<{ transaction: ApiFinanceTransaction }>("/finance/transactions", payload, true);
}

export function payCotisationRequest(payload: PayCotisationPayload = {}) {
  return apiPost<{ cotisation: ApiCotisation }>("/finance/cotisations", payload, true);
}
