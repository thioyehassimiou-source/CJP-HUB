export const FINANCE_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBR4Lnxr9iItWN8kTNws3jKGJR5hYut67fEz4mHHzxrbX95hB-OnNTAiiKmIzwRYo2_CH9Kg8yKYeY8yN-TK5vO999pWyGjyYs4-ejEkiSoCpjV9EaesrYR72eLyoFGOdUbiSGO8WBCqRfdmA3Nefm2kyRqOM2ZruakMVCLvF0OVRaSAd0AK-x1qpiUQ64lv5NqfF9XXvOv78nU-avXfTv_nhtJB1m1bKOFV4NGjg_mP_XklUbY4rIDGtP0XRNAbwJpJrVAH1-hEhM";

export const FINANCE_SUMMARY = {
  netBalance: "14 250 600 GNF",
  totalIncome: "28 400 000 GNF",
  totalExpenses: "14 149 400 GNF",
};

export const MEMBER_CONTRIBUTION = {
  status: "PAYÉ",
  academicYear: "2025-2026",
  message:
    "La cotisation de l'année académique 2025-2026 est entièrement réglée. Vous êtes membre actif avec un accès complet aux ressources de l'Académie.",
};

export type FinanceTransaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  categoryClass: string;
  amount: string;
  amountClass: string;
  striped?: boolean;
};

export const FINANCE_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: "1",
    date: "24 oct. 2023",
    description: "Hébergement cloud AWS — Oct",
    category: "Infrastructure",
    categoryClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    amount: "- 150 000 GNF",
    amountClass: "text-error",
  },
  {
    id: "2",
    date: "22 oct. 2023",
    description: "Cotisation — Sarah Chen",
    category: "Cotisations",
    categoryClass: "bg-secondary-container text-on-secondary-fixed-variant",
    amount: "+ 50 000 GNF",
    amountClass: "text-secondary",
    striped: true,
  },
  {
    id: "3",
    date: "18 oct. 2023",
    description: "Restauration atelier #12",
    category: "Événements",
    categoryClass: "bg-surface-variant text-on-surface-variant",
    amount: "- 82 400 GNF",
    amountClass: "text-error",
  },
  {
    id: "4",
    date: "15 oct. 2023",
    description: "Sponsoring : Tech Corp",
    category: "Partenariat",
    categoryClass: "bg-secondary-fixed text-on-secondary-fixed",
    amount: "+ 2 000 000 GNF",
    amountClass: "text-secondary",
    striped: true,
  },
  {
    id: "5",
    date: "10 oct. 2023",
    description: "Renouvellement domaine (cjp-hub.gn)",
    category: "Infrastructure",
    categoryClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    amount: "- 25 000 GNF",
    amountClass: "text-error",
  },
];

export const EXPENSE_BREAKDOWN = [
  { label: "Infrastructure & hébergement", percent: 65, colorClass: "bg-primary" },
  { label: "Restauration événements", percent: 20, colorClass: "bg-secondary" },
  { label: "Marketing & matériel", percent: 15, colorClass: "bg-tertiary-fixed" },
];
