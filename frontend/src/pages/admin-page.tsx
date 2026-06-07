import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { AdminWorkspace } from "@/features/doc-gen";

export function AdminPage() {
  return (
    <CjpDashboardPage
      titleBold="Génération"
      titleLight=" de documents"
      subtitle="Attestations, affiches et documents officiels du club."
    >
      <AdminWorkspace embedded />
    </CjpDashboardPage>
  );
}
