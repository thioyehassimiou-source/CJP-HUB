import type { Cotisation, Transaction, TransactionType } from "@prisma/client";

export function formatGnf(amount: number) {
  return `${amount.toLocaleString("fr-FR")} GNF`;
}

export function toPublicTransaction(transaction: Transaction) {
  const signedAmount =
    transaction.type === "INCOME" ? transaction.amount : -transaction.amount;

  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    signedAmount,
    category: transaction.category,
    description: transaction.description,
    transactionAt: transaction.transactionAt.toISOString(),
    receiptUrl: transaction.receiptUrl,
  };
}

export function toPublicCotisation(cotisation: Cotisation) {
  return {
    id: cotisation.id,
    amount: cotisation.amount,
    status: cotisation.status,
    academicYear: cotisation.academicYear,
    paidAt: cotisation.paidAt?.toISOString() ?? null,
    receiptNo: cotisation.receiptNo,
    paymentMethod: cotisation.paymentMethod,
    paymentPhone: cotisation.paymentPhone,
    paymentReference: cotisation.paymentReference,
  };
}

export function buildMonthlyChart(transactions: Transaction[]) {
  const buckets = new Map<string, { income: number; expenses: number }>();

  for (const transaction of transactions) {
    const date = transaction.transactionAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key) ?? { income: 0, expenses: 0 };

    if (transaction.type === "INCOME") {
      bucket.income += transaction.amount;
    } else {
      bucket.expenses += transaction.amount;
    }

    buckets.set(key, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, values]) => {
      const [, month] = key.split("-");
      const monthIndex = Number(month) - 1;
      const label = new Date(2026, monthIndex, 1).toLocaleDateString("fr-FR", {
        month: "short",
      });

      return {
        month: label,
        income: values.income,
        expenses: values.expenses,
      };
    });
}

export function isValidTransactionType(value: string): value is TransactionType {
  return value === "INCOME" || value === "EXPENSE";
}