export function formatGnf(amount: number) {
  return `${amount.toLocaleString("fr-FR")} GNF`;
}

export function formatSignedGnf(signedAmount: number) {
  const prefix = signedAmount >= 0 ? "+ " : "- ";
  return `${prefix}${formatGnf(Math.abs(signedAmount))}`;
}

export function formatFinanceDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cotisationStatusLabel(status: string) {
  switch (status) {
    case "PAID":
      return "Payé";
    case "PARTIAL":
      return "Partiel";
    default:
      return "Non payé";
  }
}
