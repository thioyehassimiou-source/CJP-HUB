import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { FormationQuizPanel } from "@/features/formations/components/formation-quiz-panel";
import { useParams } from "react-router-dom";

export function FormationQuizPage() {
  const { formationId } = useParams<{ formationId: string }>();

  if (!formationId) {
    return null;
  }

  return (
    <CjpDashboardPage
      titleBold="Quiz"
      titleLight=" de formation"
      subtitle="Validez vos acquis et obtenez un certificat vérifiable CJP."
    >
      <FormationQuizPanel formationId={formationId} />
    </CjpDashboardPage>
  );
}
