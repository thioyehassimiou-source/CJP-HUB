import { useState } from "react";
import { CjpButton, CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { CreateEventModal } from "@/features/events/components/create-event-modal";
import { EventsApiDashboard } from "@/features/events/components/events-api-dashboard";

export function EvenementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <CjpDashboardPage
      titleBold="Gestion"
      titleLight=" des événements"
      subtitle="Coordonnez les ateliers, hackathons et rencontres de la communauté CJP."
      actions={
        <CjpButton showArrow={false} onClick={() => setModalOpen(true)}>
          Nouvel événement
        </CjpButton>
      }
      fab={{
        onClick: () => setModalOpen(true),
        ariaLabel: "Créer un événement",
      }}
    >
      <EventsApiDashboard key={refreshKey} />
      <CreateEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => setRefreshKey((value) => value + 1)}
      />
    </CjpDashboardPage>
  );
}
