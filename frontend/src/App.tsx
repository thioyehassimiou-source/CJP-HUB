import { Route, Routes } from "react-router-dom";
import { AuthCallbackPage } from "@/pages/auth-callback-page";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { AProposPage } from "@/pages/a-propos-page";
import { AdminPage } from "@/pages/admin-page";
import { BibliothequePage } from "@/pages/bibliotheque-page";
import { ConnexionPage } from "@/pages/connexion-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { EvenementsPage } from "@/pages/evenements-page";
import { FormationCoursePage } from "@/pages/formation-course-page";
import { FormationQuizPage } from "@/pages/formation-quiz-page";
import { CertificateVerifyPage } from "@/pages/certificate-verify-page";
import { FormationsPage } from "@/pages/formations-page";
import { HomePage } from "@/pages/home-page";
import { InscriptionPage } from "@/pages/inscription-page";
import { MembresPage } from "@/pages/membres-page";
import { MessagesPage } from "@/pages/messages-page";
import { NouveauProjetPage } from "@/pages/nouveau-projet-page";
import { ParametresPage } from "@/pages/parametres-page";
import { PublicEvenementsPage } from "@/pages/public-evenements-page";
import { PublicFormationsPage } from "@/pages/public-formations-page";
import { PublicTresoreriePage } from "@/pages/public-tresorerie-page";
import { PublicBibliothequePage } from "@/pages/public-bibliotheque-page";
import { PublicProjetsPage } from "@/pages/public-projets-page";
import { PaiementPage } from "@/pages/paiement-page";
import { ProjetsPage } from "@/pages/projets-page";
import { TresoreriePage } from "@/pages/tresorerie-page";
import { FastPassPage } from "@/pages/fast-pass-page";
import { ScannerPage } from "@/pages/scanner-page";
import { ClaimCertificatePage } from "@/pages/claim-certificate-page";
import { CampaignDetailsPage } from "@/pages/campaign-details-page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/a-propos" element={<AProposPage />} />
      <Route path="/membres" element={<MembresPage />} />
      <Route path="/formations" element={<PublicFormationsPage />} />
      <Route path="/evenements" element={<PublicEvenementsPage />} />
      <Route path="/tresorerie" element={<PublicTresoreriePage />} />
      <Route path="/bibliotheque" element={<PublicBibliothequePage />} />
      <Route path="/projets" element={<PublicProjetsPage />} />
      <Route path="/certificats/verify" element={<CertificateVerifyPage />} />
      <Route path="/certificats/verify/:number" element={<CertificateVerifyPage />} />
      <Route path="/connexion" element={<ConnexionPage />} />
      <Route path="/inscription" element={<InscriptionPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/pass" element={<FastPassPage />} />
      <Route path="/scan/:token" element={<ScannerPage />} />
      <Route path="/claim" element={<ClaimCertificatePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/formations"
        element={
          <ProtectedRoute>
            <FormationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/formations/:formationId/quiz"
        element={
          <ProtectedRoute>
            <FormationQuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/formations/cours/:courseId"
        element={
          <ProtectedRoute>
            <FormationCoursePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/evenements"
        element={
          <ProtectedRoute>
            <EvenementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tresorerie"
        element={
          <ProtectedRoute>
            <TresoreriePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tresorerie/paiement"
        element={
          <ProtectedRoute>
            <PaiementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projets"
        element={
          <ProtectedRoute>
            <ProjetsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projets/nouveau"
        element={
          <ProtectedRoute>
            <NouveauProjetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/parametres"
        element={
          <ProtectedRoute>
            <ParametresPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/campaigns/:id"
        element={
          <ProtectedRoute>
            <CampaignDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/bibliotheque"
        element={
          <ProtectedRoute>
            <BibliothequePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
