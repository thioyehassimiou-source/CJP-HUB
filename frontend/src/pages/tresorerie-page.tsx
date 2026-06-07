import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { FinanceApiDashboard } from "@/features/finance/components/finance-api-dashboard";

export function TresoreriePage() {
  return (
    <CjpDashboardPage
      titleBold="Trésorerie"
      subtitle="Transparence financière et suivi des cotisations du club."
    >
      <FinanceApiDashboard />
    </CjpDashboardPage>
  );
}
