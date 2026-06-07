import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { LibraryApiDashboard } from "@/features/library/components/library-api-dashboard";

export function BibliothequePage() {
  return (
    <CjpDashboardPage
      titleBold="Bibliothèque"
      titleLight=" & Archives"
      subtitle="Ressources académiques et documents officiels du Club des Jeunes Programmeurs."
    >
      <LibraryApiDashboard />
    </CjpDashboardPage>
  );
}
