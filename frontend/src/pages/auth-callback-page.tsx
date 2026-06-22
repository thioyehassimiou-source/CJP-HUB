import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import { setAuthToken } from "@/lib/api/client";
import { Icon } from "@/components/ui/icon";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAuthToken(token);
      refreshUser().then(() => {
        navigate("/dashboard", { replace: true });
      });
    } else {
      navigate("/connexion", { replace: true });
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cjp-black)]">
      <div className="flex flex-col items-center space-y-4">
        <Icon name="sync" className="animate-spin text-4xl text-[var(--cjp-gold)]" />
        <h2 className="text-xl font-semibold text-white">Connexion en cours...</h2>
        <p className="text-[var(--cjp-text-muted)]">Veuillez patienter pendant que nous vous connectons.</p>
      </div>
    </div>
  );
}
