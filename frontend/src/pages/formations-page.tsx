import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { FormationsApiList } from "@/features/formations/components/formations-api-list";

export function FormationsPage() {
  return (
    <CjpDashboardPage
      titleBold="Catalogue"
      titleLight=" des formations"
      subtitle="Parcours certifiants du CJP — données live depuis la plateforme."
    >
      <FormationsApiList />
    </CjpDashboardPage>
  );
}
