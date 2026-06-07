import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { ProjectsApiDashboard } from "@/features/portfolio/components/projects-api-dashboard";

export function ProjetsPage() {
  return (
    <CjpDashboardPage
      titleBold="Portfolio"
      titleLight=" membre"
      subtitle="Vos projets et ceux de la communauté CJP — données live."
    >
      <ProjectsApiDashboard />
    </CjpDashboardPage>
  );
}
