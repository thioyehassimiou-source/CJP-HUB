import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { ApiClientError } from "@/lib/api/client";
import { payCotisationRequest } from "@/lib/api/finance";
import {
  formatGuineaPhone,
  formatPaymentDate,
  isValidGuineaPhone,
  PAYMENT_PROVIDERS,
  PAYMENT_SECURITY_BADGES,
  PAYMENT_SUMMARY,
  type PaymentProvider,
} from "@/features/finance/data/payment-data";
import { cn } from "@/lib/utils";

type PaymentPhase = "form" | "processing" | "success";

type SecurePaymentFlowProps = {
  embedded?: boolean;
};

export function SecurePaymentFlow({ embedded = false }: SecurePaymentFlowProps) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<PaymentPhase>("form");
  const [reference, setReference] = useState("");
  const [paidAt, setPaidAt] = useState("");

  const selectedProvider = PAYMENT_PROVIDERS.find((item) => item.id === provider);
  const phoneEnabled = provider !== null;
  const canPay = phoneEnabled;

  const handlePhoneChange = (value: string) => {
    setPhone(formatGuineaPhone(value));
  };

  const handlePay = () => {
    if (!isValidGuineaPhone(phone)) {
      window.alert("Veuillez entrer un numéro de téléphone valide.");
      return;
    }

    setPhase("processing");
    window.setTimeout(async () => {
      try {
        const { cotisation } = await payCotisationRequest(50000);
        setReference(cotisation.receiptNo ?? "CJP-RCP");
        setPaidAt(formatPaymentDate(new Date()));
        setPhase("success");
      } catch (error) {
        setPhase("form");
        window.alert(
          error instanceof ApiClientError ? error.message : "Paiement impossible",
        );
      }
    }, 2000);
  };

  const handleFinish = () => {
    navigate("/dashboard/tresorerie");
  };

  const formContent = (
    <>
      <div className="mb-lg rounded-xl border border-outline-variant bg-surface-container-low p-lg shadow-sm">
        <div className="mb-md flex items-start justify-between">
          <div>
            <p className="mb-xs text-label-md text-on-surface-variant">{PAYMENT_SUMMARY.transactionType}</p>
            <h2 className="text-headline-md font-bold">{PAYMENT_SUMMARY.title}</h2>
          </div>
          <div className="rounded-lg border border-outline-variant bg-white p-sm">
            <img src={PAYMENT_SUMMARY.logo} alt="CJP Logo" className="h-12 w-12 object-contain" />
          </div>
        </div>
        <div className="flex items-end justify-between border-t border-outline-variant pt-md">
          <span className="text-label-md uppercase text-on-surface-variant">Montant Total</span>
          <span className="text-display-lg text-primary">{PAYMENT_SUMMARY.amount}</span>
        </div>
      </div>

      <div className="space-y-lg">
        <section>
          <h3 className="mb-md text-headline-md font-bold">1. Choisir l&apos;opérateur</h3>
          <div className="grid grid-cols-2 gap-md">
            {PAYMENT_PROVIDERS.map((item) => {
              const active = provider === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProvider(item.id)}
                  className={cn(
                    "group flex flex-col items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-lg transition-all hover:bg-surface-container-high",
                    active && "active-provider",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-lg p-2",
                      item.bgClass,
                    )}
                  >
                    <img src={item.logo} alt={item.label} className="h-full w-full object-contain" />
                  </div>
                  <span className="text-label-md font-bold text-on-surface">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className={cn(
            "transition-opacity duration-300",
            phoneEnabled ? "opacity-100" : "pointer-events-none opacity-40",
          )}
        >
          <h3 className="mb-md text-headline-md font-bold">2. Coordonnées de paiement</h3>
          <div className="space-y-md">
            <div className="relative">
              <label htmlFor="phone" className="mb-xs block text-label-md text-on-surface-variant">
                Numéro de téléphone Guinéen
              </label>
              <div className="flex items-center rounded-lg border border-outline bg-surface-container-lowest transition-all focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary">
                <span className="pl-md text-body-md text-on-surface-variant">+224</span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="6XX XX XX XX"
                  className="w-full border-none bg-transparent px-sm py-md font-code-sm text-[16px] focus:ring-0"
                />
              </div>
            </div>
          </div>
        </section>

        {selectedProvider ? (
          <section>
            <div className="space-y-sm rounded-r-lg border-l-4 border-on-tertiary-fixed-variant bg-tertiary-fixed/30 p-md">
              <h4 className="flex items-center gap-xs text-label-md text-on-tertiary-fixed-variant">
                <Icon name="info" className="text-[18px]" />
                INSTRUCTIONS DE VALIDATION
              </h4>
              <ol className="space-y-sm text-body-md text-on-surface">
                <li className="flex gap-sm">
                  <span className="font-bold">1.</span>
                  <span>{selectedProvider.ussd}</span>
                </li>
                <li className="flex gap-sm">
                  <span className="font-bold">2.</span>
                  <span>Entrez votre code secret pour valider.</span>
                </li>
                <li className="flex gap-sm">
                  <span className="font-bold">3.</span>
                  <span>Attendez la confirmation ici même.</span>
                </li>
              </ol>
            </div>
          </section>
        ) : null}

        <button
          type="button"
          disabled={!canPay || phase !== "form"}
          onClick={handlePay}
          className={cn(
            "flex w-full items-center justify-center gap-md rounded-xl bg-primary py-lg text-headline-md text-white shadow-lg transition-all",
            canPay ? "hover:scale-[1.02] active:scale-[0.98]" : "cursor-not-allowed opacity-50",
          )}
        >
          <span>Payer {PAYMENT_SUMMARY.amount}</span>
          <Icon name="security" />
        </button>

        <div className="flex items-center justify-center gap-lg pt-md opacity-60 grayscale transition-all hover:grayscale-0">
          {PAYMENT_SECURITY_BADGES.map((badge) => (
            <img key={badge.id} src={badge.src} alt={badge.alt} className="h-6 object-contain" />
          ))}
        </div>
      </div>
    </>
  );

  const overlays = (
    <>
      {phase === "success" ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-primary-container/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-[400px] space-y-lg rounded-2xl bg-white p-xl text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 animate-pulse-soft items-center justify-center rounded-full bg-secondary">
              <Icon name="check_circle" filled className="text-[48px] text-white" />
            </div>
            <div className="space-y-sm">
              <h2 className="text-headline-lg text-primary">Paiement Réussi !</h2>
              <p className="text-body-lg text-on-surface-variant">
                Votre cotisation pour 2025-2026 a été enregistrée avec succès.
              </p>
            </div>
            <div className="rounded-lg bg-surface-container p-md text-left font-code-sm text-code-sm text-on-surface">
              <div className="flex justify-between py-1">
                <span>Réf:</span>
                <span className="font-bold">{reference}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Montant:</span>
                <span className="font-bold text-secondary">{PAYMENT_SUMMARY.amount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Date:</span>
                <span>{paidAt}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-xl bg-secondary py-md text-headline-md text-white transition-colors hover:bg-on-secondary-container"
            >
              Terminer
            </button>
          </div>
        </div>
      ) : null}

      {phase === "processing" ? (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="space-y-md text-center">
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-outline-variant" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent" />
            </div>
            <p className="text-headline-md font-bold text-primary">En attente de validation...</p>
            <p className="animate-pulse text-on-surface-variant">
              Veuillez confirmer l&apos;opération sur votre mobile.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <div className="mx-auto max-w-[480px]">
        {formContent}
        {overlays}
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body-md text-body-md text-on-surface">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-surface-container-lowest px-lg shadow-sm">
        <div className="flex items-center gap-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full p-base transition-colors hover:bg-surface-container-high"
            aria-label="Retour"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-headline-md font-bold text-primary">Paiement Sécurisé</h1>
        </div>
        <div className="flex items-center gap-xs rounded-full bg-secondary-container px-sm py-1">
          <Icon name="lock" filled className="text-[16px] text-on-secondary-container" />
          <span className="text-label-md text-on-secondary-container">SSL 256-bit</span>
        </div>
      </header>

      <main className="mx-auto max-w-[480px] px-margin-mobile py-xl md:px-lg">
        {formContent}
      </main>

      {overlays}
    </div>
  );
}
