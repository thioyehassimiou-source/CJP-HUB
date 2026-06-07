

import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import {
  EXPENSE_BREAKDOWN,
  FINANCE_SUMMARY,
  FINANCE_TRANSACTIONS,
  MEMBER_CONTRIBUTION,
} from "@/features/finance/data/finance-data";
import { cn } from "@/lib/utils";

function ReceiptButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex justify-center">
      {showTooltip ? (
        <span className="absolute -top-7 left-1/2 z-[100] -translate-x-1/2 rounded bg-inverse-surface px-2 py-1 text-[10px] text-inverse-on-surface shadow-lg">
          Voir le document
        </span>
      ) : null}
      <button
        type="button"
        className="text-secondary transition-transform hover:scale-110"
        aria-label="Voir le reçu"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon name="visibility" />
      </button>
    </div>
  );
}

export function FinanceTransparency() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-lg grid grid-cols-1 gap-lg md:grid-cols-12">
        <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm md:col-span-8">
          <div className="relative z-10">
            <p className="mb-xs text-label-md uppercase tracking-widest text-on-surface-variant">
              Solde net disponible
            </p>
            <h3 className="mb-lg text-display-lg text-primary">{FINANCE_SUMMARY.netBalance}</h3>
            <div className="grid grid-cols-2 gap-xl border-t border-outline-variant pt-lg">
              <div>
                <div className="mb-xs flex items-center gap-xs text-secondary">
                  <Icon name="trending_up" className="text-[18px]" />
                  <span className="text-label-md">Recettes totales</span>
                </div>
                <p className="text-headline-md font-bold">{FINANCE_SUMMARY.totalIncome}</p>
              </div>
              <div>
                <div className="mb-xs flex items-center gap-xs text-error">
                  <Icon name="trending_down" className="text-[18px]" />
                  <span className="text-label-md">Dépenses totales</span>
                </div>
                <p className="text-headline-md font-bold">{FINANCE_SUMMARY.totalExpenses}</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-5">
            <Icon name="account_balance_wallet" className="text-[240px]" />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-outline-variant bg-primary-container p-lg text-on-primary-fixed shadow-sm md:col-span-4">
          <div>
            <div className="mb-md flex items-start justify-between">
              <h4 className="text-headline-md font-bold text-white">Mon statut</h4>
              <span className="rounded-full bg-secondary-container px-md py-xs text-label-md text-on-secondary-fixed">
                {MEMBER_CONTRIBUTION.status}
              </span>
            </div>
            <p className="mb-lg text-body-md text-on-primary-container">
              {MEMBER_CONTRIBUTION.message}
            </p>
          </div>
          <Link
            to="/dashboard/tresorerie/paiement"
            className="mb-sm flex w-full items-center justify-center gap-sm rounded-lg bg-secondary px-lg py-md text-label-md text-white transition-all hover:opacity-90"
          >
            <Icon name="payments" />
            Payer ma cotisation
          </Link>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-surface-container-lowest px-lg py-md text-label-md text-primary transition-all hover:bg-surface-container-high"
          >
            <Icon name="receipt_long" />
            Obtenir mon reçu de paiement
          </button>
        </div>
      </div>

      <div className="mb-md flex flex-col items-end justify-between gap-md md:flex-row">
        <div>
          <h3 className="text-headline-lg text-primary">Transparence du grand livre</h3>
          <p className="text-body-md text-on-surface-variant">
            Registre en temps réel de tous les mouvements financiers du club
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg border border-outline px-md py-2 text-label-md transition-all hover:bg-surface-container-low"
          >
            <Icon name="filter_list" />
            Filtrer
          </button>
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg bg-primary px-md py-2 text-label-md text-white transition-all hover:bg-opacity-80"
          >
            <Icon name="download" />
            Télécharger le rapport financier
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-lg py-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  Date
                </th>
                <th className="px-lg py-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  Description
                </th>
                <th className="px-lg py-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  Catégorie
                </th>
                <th className="px-lg py-md text-right text-label-md uppercase tracking-wider text-on-surface-variant">
                  Montant
                </th>
                <th className="w-24 px-lg py-md text-center text-label-md uppercase tracking-wider text-on-surface-variant">
                  Reçu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {FINANCE_TRANSACTIONS.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={cn(
                    "transition-colors hover:bg-surface-container-high",
                    transaction.striped && "bg-surface-container-low",
                  )}
                >
                  <td className="px-lg py-md font-mono text-[13px] leading-[18px] text-on-surface-variant">
                    {transaction.date}
                  </td>
                  <td className="px-lg py-md text-body-md font-bold text-primary">
                    {transaction.description}
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={cn(
                        "rounded px-sm py-xs text-[10px] font-label-md uppercase",
                        transaction.categoryClass,
                      )}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-lg py-md text-right font-mono text-[13px] leading-[18px]",
                      transaction.amountClass,
                    )}
                  >
                    {transaction.amount}
                  </td>
                  <td className="px-lg py-md text-center">
                    <ReceiptButton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container px-lg py-md">
          <p className="text-label-md text-on-surface-variant">
            Affichage de 5 sur 142 transactions
          </p>
          <div className="flex gap-xs">
            <button
              type="button"
              className="rounded border border-outline p-1 transition-colors hover:bg-surface-container-high"
              aria-label="Page précédente"
            >
              <Icon name="chevron_left" className="text-[16px]" />
            </button>
            <button
              type="button"
              className="rounded border border-outline p-1 transition-colors hover:bg-surface-container-high"
              aria-label="Page suivante"
            >
              <Icon name="chevron_right" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-lg grid grid-cols-1 gap-lg md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <h4 className="mb-md text-headline-md font-bold text-primary">
            Répartition des dépenses
          </h4>
          <div className="mb-lg flex h-4 w-full overflow-hidden rounded-full bg-surface-container">
            {EXPENSE_BREAKDOWN.map((item) => (
              <div
                key={item.label}
                className={cn("h-full", item.colorClass)}
                style={{ width: `${item.percent}%` }}
              />
            ))}
          </div>
          <div className="space-y-sm">
            {EXPENSE_BREAKDOWN.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className={cn("h-3 w-3 rounded-full", item.colorClass)} />
                  <span className="text-body-md">{item.label}</span>
                </div>
                <span className="font-mono text-[13px] font-bold leading-[18px]">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-lg text-center">
          <Icon name="verified_user" className="text-[48px] text-secondary" />
          <h4 className="mt-md text-headline-md font-bold text-primary">Intégrité des audits</h4>
          <p className="mx-auto mt-sm max-w-[24rem] text-body-md text-on-surface-variant">
            Les finances du CJP HUB sont auditées mensuellement par le bureau exécutif pour
            garantir 100 % de transparence et la confiance des membres.
          </p>
          <button
            type="button"
            className="mt-lg rounded-lg border-2 border-primary px-lg py-2 text-label-md font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            Voir l&apos;historique des audits
          </button>
        </div>
      </div>
    </div>
  );
}
