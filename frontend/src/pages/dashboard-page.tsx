import { CjpAdminDashboard } from "@/features/dashboard/components/cjp-admin-dashboard";
import { CjpDashboardShell } from "@/features/dashboard/components/cjp-dashboard-shell";

export function DashboardPage() {
  return (
    <CjpDashboardShell>
      <CjpAdminDashboard />
    </CjpDashboardShell>
  );
}
