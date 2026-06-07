import { apiGet, apiPost } from "@/lib/api/client";
import type {
  ApiCotisation,
  ApiFinanceTransaction,
  CreateFinanceTransactionPayload,
  FinanceSummary,
} from "@/lib/api/types";

export function fetchFinanceSummary() {
  return apiGet<FinanceSummary>("/finance/summary", false);
}

export function fetchFinanceTransactions() {
  return apiGet<{ transactions: ApiFinanceTransaction[] }>("/finance/transactions", false);
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

export function payCotisationRequest(amount?: number) {
  return apiPost<{ cotisation: ApiCotisation }>("/finance/cotisations", { amount }, true);
}
