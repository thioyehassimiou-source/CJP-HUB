import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { SecurePaymentFlow } from "@/features/finance/components/secure-payment-flow";

export function PaiementPage() {
  return (
    <CjpDashboardPage
      hideSidebar
      light
      titleBold="Paiement"
      titleLight=" sécurisé"
      subtitle="Cotisation annuelle — transaction chiffrée SSL 256-bit."
      actions={
        <Link
          to="/dashboard/tresorerie"
          className="inline-flex items-center gap-2 text-sm font-light text-[var(--cjp-text-muted)] transition-colors hover:text-[var(--cjp-gold)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la trésorerie
        </Link>
      }
    >
      <SecurePaymentFlow embedded />
    </CjpDashboardPage>
  );
}
