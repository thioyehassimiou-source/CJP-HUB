import { useEffect, useState } from "react";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { ApiClientError } from "@/lib/api/client";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";
import type { ApiFinanceTransaction, FinanceSummary } from "@/lib/api/types";
import { formatFinanceDate, formatGnf, formatSignedGnf } from "@/lib/finance-display";
import { cn } from "@/lib/utils";

export function CjpTresoreriePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<ApiFinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchFinanceSummary(), fetchFinanceTransactions()])
      .then(([summaryData, transactionsData]) => {
        if (cancelled) return;
        setSummary(summaryData);
        setTransactions(transactionsData.transactions);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiClientError ? error.message : "Impossible de charger la trésorerie",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const maxValue = Math.max(
    ...(summary?.chart.flatMap((item) => [item.income, item.expenses]) ?? [1]),
    1,
  );

  return (
    <CjpPublicLayout variant="light">
      <section className="cjp-container py-12 md:py-16">
        <CjpDisplayTitle
          as="h1"
          bold="Trésorerie"
          light="transparente"
          lightOnDark={false}
          className="!text-[clamp(2rem,5vw,3.5rem)]"
        />
        <p className="cjp-text-lead mt-4">
          Suivi en temps réel des recettes, dépenses et cotisations du club.
        </p>

        {errorMessage ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="cjp-card-light h-28 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && summary ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { label: "Recettes totales", value: formatGnf(summary.totalIncome) },
                { label: "Dépenses totales", value: formatGnf(summary.totalExpenses) },
                { label: "Solde actuel", value: formatGnf(summary.netBalance) },
              ].map((card) => (
                <div key={card.label} className="cjp-card-light p-6">
                  <p className="cjp-label-gold">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--cjp-gold)]">{card.value}</p>
                </div>
              ))}
            </div>

            {summary.chart.length > 0 ? (
              <div className="cjp-card-light mt-10 p-6">
                <h2 className="text-lg font-bold">Recettes vs Dépenses</h2>
                <div className="mt-8 flex h-48 items-end justify-between gap-4">
                  {summary.chart.map((item) => (
                    <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-36 w-full items-end justify-center gap-1">
                        <div
                          className="w-5 rounded-t bg-[var(--cjp-gold)]"
                          style={{ height: `${(item.income / maxValue) * 100}%` }}
                          title={`Recettes ${formatGnf(item.income)}`}
                        />
                        <div
                          className="w-5 rounded-t bg-[var(--cjp-border)]"
                          style={{ height: `${(item.expenses / maxValue) * 100}%` }}
                          title={`Dépenses ${formatGnf(item.expenses)}`}
                        />
                      </div>
                      <span className="text-xs text-[var(--cjp-text-muted)]">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-6 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[var(--cjp-gold)]" /> Recettes
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[var(--cjp-border)]" /> Dépenses
                  </span>
                </div>
              </div>
            ) : null}

            <div className="cjp-card-light mt-10 overflow-hidden">
              <div className="border-b border-[var(--cjp-border)] p-6">
                <h2 className="text-lg font-bold">Historique des transactions</h2>
                <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
                  Cotisations reçues : {formatGnf(summary.cotisationsReceived)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-[var(--cjp-offwhite)] text-xs uppercase tracking-wider text-[var(--cjp-text-muted)]">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Libellé</th>
                      <th className="px-6 py-3">Montant</th>
                      <th className="px-6 py-3">Catégorie</th>
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
                      <tr key={tx.id} className="border-t border-[var(--cjp-border)]">
                        <td className="px-6 py-4 font-light">{formatFinanceDate(tx.transactionAt)}</td>
                        <td className="px-6 py-4">{tx.description}</td>
                        <td
                          className={cn(
                            "px-6 py-4 font-semibold",
                            tx.signedAmount >= 0
                              ? "text-[var(--cjp-gold-dark)]"
                              : "text-[var(--cjp-black)]",
                          )}
                        >
                          {formatSignedGnf(tx.signedAmount)}
                        </td>
                        <td className="px-6 py-4 text-[var(--cjp-text-muted)]">{tx.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </CjpPublicLayout>
  );
}
