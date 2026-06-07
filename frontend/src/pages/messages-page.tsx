import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { MessagingConsole } from "@/features/messaging";

export function MessagesPage() {
  return (
    <CjpDashboardPage
      fullWidth
      contentClassName="flex min-h-[calc(100vh-var(--cjp-nav-height))] flex-1 overflow-hidden"
    >
      <MessagingConsole />
    </CjpDashboardPage>
  );
}
