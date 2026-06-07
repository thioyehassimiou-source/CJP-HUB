import { CJP_LOGO } from "@/lib/cjp-brand";

export type PaymentProvider = "orange" | "mtn";

export const PAYMENT_SUMMARY = {
  transactionType: "TYPE DE TRANSACTION",
  title: "Cotisation Annuelle 2024",
  amount: "50.000 GNF",
  amountValue: 50000,
  logo: CJP_LOGO.onLight,
};

export const PAYMENT_PROVIDERS: Array<{
  id: PaymentProvider;
  label: string;
  logo: string;
  bgClass: string;
  ussd: string;
}> = [
  {
    id: "orange",
    label: "Orange Money",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcjKYkjNU4hRgPFNntfbxtGeGk-Mu11GssDE7ASLrfkdMmVEt6c2XDELNodBZ6ojufOpJwyP8xF_xVxlNYJkKNCsucXZBG9TVtkHjGYFwVRScxWBL9HwId0_aQ9QDZJQ563XRMfDn8KrIfgd610ngdLPwRQw4EYxlZW2VQq_3upwVDIkZu5grVvrNYsJNUxHhZRMqUB92UGM-fShqnfKAko-P9qneJ5HIXYGrKWpzL4bOPOJHe7azQpJ-9vDvwC5FQDVN40nyG_8M",
    bgClass: "bg-[#FF7900]",
    ussd: "Composez *144*4*2# sur votre téléphone.",
  },
  {
    id: "mtn",
    label: "MTN MoMo",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdAjgjA-00iefhyqaeAtKaHNIDdjuUBQiqDV_jKwt-t01kut1w32iGm_myD4jmvNSPeSsHTuT1G1bDTdv-o446Aq8KLAtTAsebRl4pt5pDReIrfAOvJW3Iw5HTx4IfB9rwfOIZZUce-_zCZdOIdphmKo1RP-J_ZDnTVrYu_Z_0EKSPREkQLAtKtzOWQQICficBifCVv4Jd7DalFgayWoWs-UNYBVmVSKlgIG6TDGWgq3WleCYuP7LCDPlVGBes-41HyP1rGndwxkg",
    bgClass: "bg-[#FFCC00]",
    ussd: "Composez *440# sur votre téléphone.",
  },
];

export const PAYMENT_SECURITY_BADGES = [
  {
    id: "pci",
    alt: "PCI DSS Compliant",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7gTRi4MUckPWL8nw0BEazbzp3wRv_QKLhVjSBBx4u6jvkyimN2XtL_Mrbx0JsMvuYyE9m0M6KBAxtfW1O0eJZtFHL6EWtqrdIllVa5XxQW3eyuNC9qZ6BY4o94gYwz6GRplGqxrkRMUed9ov2VAUdTbx49-EvwSWpteQTF0g7CjCIRi22Nd0jOky4mrqYfhrNFy7RIep4KJJnzABPXY-tGJvT1ygu8XvkpQewC29E0whSPW6S4xmYjAi_6-USzd2JMRR14Qab5gE",
  },
  {
    id: "visa",
    alt: "Visa Verified",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA630vArR_S9Y_63vmDbJsT7eXXewCD5LWwcj-zG8dK01wEdmHbPCP7lJggtJ2K1lB0Flh7ugskK_-21FTrOISEiLdZ2YPL3rW3A-OBf3PA_GoiUgo24QdUoV_rM5mnKK8HphQrvynhfI5xzWJSU4TIFymM0QMIQu3pKQxsXHjrwhsUgF6QGe5VLA8pA6-hB6cyWkVLmSybcVTBvKTfDD9TYu0enS8U0CFmrXxDFlovmm4K1QVC5UJV_QT8tHgjjJXRkeuR0D4oH4M",
  },
  {
    id: "ssl",
    alt: "Secure Socket Layer",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTsg4gO2dbgpSNrI4yF36PXj1csuMGJSAPoHiNbUlKkaQe128XK5KpWhwO2VAEUDWRhhlkvQYedEjcZ34NztmG3SLZZMKzDxmIjCKVMMBKty4voWeJ3CmTv82PVgo_wK8LO8NF8gGsYlgDmXRGOop5wsbyT2KSDmXLaRyYkRuV61ijRnzxm6FjPAL408cqmsh9_KNIyjWiPLyP7p49gtok6Vdr3m9Va5NsiaXfoVUY6_uIkfzE-lUsTUFz4dzXBeUes0SAhSfY9eU",
  },
];

export function formatGuineaPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const parts = digits.match(/(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})/);
  if (!parts) return digits;
  if (!parts[2]) return parts[1];
  return `${parts[1]} ${parts[2]}${parts[3] ? ` ${parts[3]}` : ""}${parts[4] ? ` ${parts[4]}` : ""}`;
}

export function isValidGuineaPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 9;
}

export function generatePaymentReference(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `#CJP-2024-${suffix}`;
}

export function formatPaymentDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
