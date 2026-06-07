import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import type { UserRole } from "@/lib/api/types";

type RoleRouteProps = {
  children: React.ReactNode;
  allowed: UserRole[];
  fallback?: string;
};

export function RoleRoute({ children, allowed, fallback = "/dashboard" }: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--cjp-text-muted)]">
        Chargement…
      </div>
    );
  }

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}
