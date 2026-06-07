import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { SettingsWorkspace } from "@/features/settings";

export function ParametresPage() {
  return (
    <CjpDashboardPage
      titleBold="Paramètres"
      subtitle="Gérez votre profil, vos préférences et la confidentialité de votre compte."
    >
      <SettingsWorkspace />
    </CjpDashboardPage>
  );
}
