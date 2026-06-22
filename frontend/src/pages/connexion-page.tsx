import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { useAuth } from "@/features/auth/auth-context";
import { Icon } from "@/components/ui/icon";
import {
  authLinkClass,
  authSocialClass,
  authSubmitClass,
  AUTH_CONNEXION_SLIDES,
  GOOGLE_LOGO,
} from "@/lib/auth-data";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ConnexionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  // Si l'utilisateur est déjà connecté, le rediriger directement
  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState === "loading") return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setSubmitState("loading");
    setErrorMessage("");

    try {
      await login(email, password);
      setSubmitState("success");
      // Naviguer immédiatement sans délai
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Connexion impossible",
      );
      window.setTimeout(() => setSubmitState("idle"), 2000);
    }
  };

  return (
    <AuthSplitLayout
      title="Connexion"
      description="Connectez-vous avec votre e-mail universitaire ou votre compte CJP."
      slides={AUTH_CONNEXION_SLIDES}
      footer={
        <p className="mt-6 text-center text-sm text-[var(--cjp-text-muted)]">
          Nouveau membre ?{" "}
          <Link to="/inscription" className={authLinkClass}>
            S&apos;inscrire au club
          </Link>
        </p>
      }
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="relative group">
          <Icon
            name="alternate_email"
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--cjp-text-muted)] transition-colors group-focus-within:text-[var(--cjp-gold)]"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue="admin@cjp.ul.edu.gn"
            placeholder=" "
            className="peer w-full rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_35%,#ccc)] bg-white pb-2 pl-12 pr-4 pt-6 text-sm text-[var(--cjp-black)] outline-none transition-all focus:border-[var(--cjp-gold)] focus:ring-2 focus:ring-[var(--cjp-gold)]/20"
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-12 top-4 -translate-y-1/2 cursor-text select-none text-xs text-[var(--cjp-text-muted)] transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:text-xs peer-focus:text-[var(--cjp-gold-dark)]"
          >
            E-mail universitaire
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-end">
            <Link to="/connexion" className={authLinkClass}>
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative group">
            <Icon
              name="lock"
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--cjp-text-muted)] transition-colors group-focus-within:text-[var(--cjp-gold)]"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_35%,#ccc)] bg-white pb-2 pl-12 pr-4 pt-6 text-sm text-[var(--cjp-black)] outline-none transition-all focus:border-[var(--cjp-gold)] focus:ring-2 focus:ring-[var(--cjp-gold)]/20"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-12 top-4 -translate-y-1/2 cursor-text select-none text-xs text-[var(--cjp-text-muted)] transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-4 peer-focus:text-xs peer-focus:text-[var(--cjp-gold-dark)]"
            >
              Mot de passe
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-[color-mix(in_srgb,var(--cjp-border)_35%,#ccc)] text-[var(--cjp-gold)] focus:ring-[var(--cjp-gold)]"
          />
          <label htmlFor="remember" className="text-sm text-[var(--cjp-text-muted)]">
            Se souvenir de moi
          </label>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--cjp-gold)] to-yellow-300 opacity-0 blur transition duration-500 group-hover:opacity-30" />
          <button
            type="submit"
            disabled={submitState === "loading" || submitState === "success"}
            className={cn(
              authSubmitClass,
              "relative overflow-hidden transition-all duration-300",
              submitState === "success" && "!bg-[var(--cjp-black)] !text-[var(--cjp-gold)]",
            )}
          >
            {submitState === "loading" && (
              <>
                <Icon name="sync" className="mr-2 animate-spin" />
                Connexion en cours...
              </>
            )}
            {submitState === "success" && (
              <div className="flex animate-[slide-up_0.3s_ease-out] items-center gap-2">
                <Icon name="check_circle" />
                Bienvenue !
              </div>
            )}
            {submitState === "idle" || submitState === "error" ? (
              <>
                Se connecter
                <span className="cjp-btn-arrow transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrow_forward" className="text-base" />
                </span>
              </>
            ) : null}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--cjp-border)_30%,#ddd)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--cjp-text-muted)]">
          Ou continuer avec
        </span>
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--cjp-border)_30%,#ddd)]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button 
          type="button" 
          onClick={() => { window.location.href = "/api/auth/google"; }}
          className={cn(authSocialClass, "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300")}
        >
          <img alt="Google" className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" src={GOOGLE_LOGO} />
          Google
        </button>
        <button 
          type="button" 
          onClick={() => { window.location.href = "/api/auth/github"; }}
          className={cn(authSocialClass, "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group")}
        >
          <Icon name="terminal" className="text-[var(--cjp-text-muted)] group-hover:text-[var(--cjp-gold-dark)] transition-colors" />
          GitHub
        </button>
      </div>
    </AuthSplitLayout>
  );
}
