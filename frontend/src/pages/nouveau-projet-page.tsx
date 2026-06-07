import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { NewProjectForm } from "@/features/portfolio/components/new-project-form";

export function NouveauProjetPage() {
  return (
    <CjpDashboardPage
      titleBold="Nouveau"
      titleLight=" projet"
      subtitle="Partagez vos réalisations avec la communauté CJP. Une documentation rigoureuse valorise votre profil professionnel."
    >
      <NewProjectForm />
    </CjpDashboardPage>
  );
}
