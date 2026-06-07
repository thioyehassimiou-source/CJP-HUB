import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cjp-black)] text-[var(--cjp-text-muted)]">
        Chargement de la session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  return children;
}
