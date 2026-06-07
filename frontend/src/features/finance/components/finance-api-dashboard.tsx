import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import {
  createFinanceTransaction,
  fetchFinanceSummary,
  fetchFinanceTransactions,
  fetchMyCotisation,
} from "@/lib/api/finance";
import type { ApiCotisation, ApiFinanceTransaction, FinanceSummary } from "@/lib/api/types";
import {
  cotisationStatusLabel,
  formatFinanceDate,
  formatGnf,
  formatSignedGnf,
} from "@/lib/finance-display";

export function FinanceApiDashboard() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMINISTRATEUR" || user?.role === "TRESORIER";
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<ApiFinanceTransaction[]>([]);
  const [cotisation, setCotisation] = useState<ApiCotisation | null>(null);
  const [defaultAmount, setDefaultAmount] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    setErrorMessage("");

    Promise.all([
      fetchFinanceSummary(),
      fetchFinanceTransactions(),
      fetchMyCotisation().catch(() => ({
        cotisation: null,
        academicYear: "2025-2026",
        defaultAmount: 50000,
      })),
    ])
      .then(([summaryData, transactionsData, cotisationData]) => {
        setSummary(summaryData);
        setTransactions(transactionsData.transactions);
        setCotisation(cotisationData.cotisation);
        setDefaultAmount(cotisationData.defaultAmount);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger la trésorerie",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrorMessage("");

    try {
      await createFinanceTransaction({
        type: String(form.get("type") ?? "EXPENSE") as "INCOME" | "EXPENSE",
        amount: Number(form.get("amount")),
        category: String(form.get("category") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        transactionAt: String(form.get("transactionAt") ?? "") || undefined,
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Enregistrement impossible",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="cjp-card-dark h-40 animate-pulse" />
        <div className="cjp-card-dark h-64 animate-pulse" />
      </div>
    );
  }

  if (errorMessage && !summary) {
    return (
      <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
        {errorMessage}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {errorMessage ? (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="cjp-card-dark p-6 lg:col-span-8">
          <p className="cjp-label-gold">Solde net disponible</p>
          <p className="mt-2 text-4xl font-bold text-[var(--cjp-white)]">
            {summary ? formatGnf(summary.netBalance) : "—"}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[var(--cjp-border)] pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--cjp-gold)]">Recettes totales</p>
              <p className="mt-1 text-xl font-bold">{summary ? formatGnf(summary.totalIncome) : "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--cjp-text-muted)]">
                Dépenses totales
              </p>
              <p className="mt-1 text-xl font-bold">{summary ? formatGnf(summary.totalExpenses) : "—"}</p>
            </div>
          </div>
        </div>

        <div className="cjp-card-dark flex flex-col justify-between p-6 lg:col-span-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-[var(--cjp-white)]">Ma cotisation</h3>
              <span className="cjp-badge-gold">
                {cotisation ? cotisationStatusLabel(cotisation.status) : "Non payé"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--cjp-text-muted)]">
              {cotisation?.status === "PAID"
                ? `Cotisation ${cotisation.academicYear} réglée. Reçu ${cotisation.receiptNo ?? ""}.`
                : `Cotisation annuelle ${defaultAmount.toLocaleString("fr-FR")} GNF pour l'année 2025-2026.`}
            </p>
          </div>
          {cotisation?.status === "PAID" ? (
            <p className="mt-6 text-xs uppercase tracking-wider text-[var(--cjp-gold)]">
              Merci pour votre contribution au club
            </p>
          ) : (
            <Link
              to="/dashboard/tresorerie/paiement"
              className="mt-6 inline-flex justify-center rounded-full bg-[var(--cjp-gold)] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-black)] transition-opacity hover:opacity-90"
            >
              Payer ma cotisation
            </Link>
          )}
        </div>
      </div>

      {canManage ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-full border border-[var(--cjp-gold)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)] hover:text-[var(--cjp-black)]"
          >
            {showForm ? "Fermer" : "Nouvelle transaction"}
          </button>
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleCreateTransaction} className="cjp-card-dark grid gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Type
            </label>
            <select name="type" className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm">
              <option value="INCOME">Recette</option>
              <option value="EXPENSE">Dépense</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Montant (GNF)
            </label>
            <input
              name="amount"
              type="number"
              min={1}
              required
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Catégorie
            </label>
            <input
              name="category"
              required
              placeholder="Cotisations, Événements…"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Date
            </label>
            <input
              name="transactionAt"
              type="date"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Description
            </label>
            <input
              name="description"
              required
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--cjp-gold)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-black)] disabled:opacity-50"
            >
              {submitting ? "Enregistrement…" : "Enregistrer la transaction"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="cjp-card-dark overflow-hidden">
        <div className="border-b border-[var(--cjp-border)] p-6">
          <h3 className="text-lg font-bold text-[var(--cjp-white)]">Grand livre</h3>
          <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
            Registre en temps réel des mouvements financiers du club
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cjp-border)] text-[10px] uppercase tracking-wider text-[var(--cjp-text-muted)]">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--cjp-text-muted)]">
                    Aucune transaction enregistrée.
                  </td>
                </tr>
              ) : null}
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-[var(--cjp-border)]">
                  <td className="px-6 py-4 text-[var(--cjp-text-muted)]">
                    {formatFinanceDate(tx.transactionAt)}
                  </td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className="px-6 py-4 text-[var(--cjp-text-muted)]">{tx.category}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      tx.signedAmount >= 0 ? "text-[var(--cjp-gold)]" : "text-red-400"
                    }`}
                  >
                    {formatSignedGnf(tx.signedAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
