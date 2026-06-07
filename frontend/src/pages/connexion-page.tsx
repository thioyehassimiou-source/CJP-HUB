import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { useAuth } from "@/features/auth/auth-context";
import { Icon } from "@/components/ui/icon";
import {
  authFieldClass,
  authLabelClass,
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
  const { login } = useAuth();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

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
      window.setTimeout(() => navigate(redirectTo, { replace: true }), 600);
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

        <div>
          <label htmlFor="email" className={authLabelClass}>
            E-mail universitaire
          </label>
          <div className="relative">
            <Icon
              name="alternate_email"
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--cjp-text-muted)]"
            />
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="admin@cjp.ul.edu.gn"
              placeholder="nom.prenom@universite.edu"
              className={cn(authFieldClass, "pl-12")}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className={authLabelClass}>
              Mot de passe
            </label>
            <Link to="/connexion" className={authLinkClass}>
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Icon
              name="lock"
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--cjp-text-muted)]"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className={cn(authFieldClass, "pl-12")}
            />
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

        <button
          type="submit"
          disabled={submitState === "loading" || submitState === "success"}
          className={cn(
            authSubmitClass,
            submitState === "success" && "!bg-[var(--cjp-black)] !text-[var(--cjp-gold)]",
          )}
        >
          {submitState === "loading" && (
            <>
              <Icon name="sync" className="animate-spin" />
              Connexion...
            </>
          )}
          {submitState === "success" && (
            <>
              <Icon name="check_circle" />
              Bienvenue !
            </>
          )}
          {submitState === "idle" || submitState === "error" ? (
            <>
              Se connecter
              <span className="cjp-btn-arrow">
                <Icon name="arrow_forward" className="text-base" />
              </span>
            </>
          ) : null}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--cjp-border)_30%,#ddd)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--cjp-text-muted)]">
          Ou continuer avec
        </span>
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--cjp-border)_30%,#ddd)]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" className={authSocialClass}>
          <img alt="Google" className="h-5 w-5 opacity-80" src={GOOGLE_LOGO} />
          Google
        </button>
        <button type="button" className={authSocialClass}>
          <Icon name="terminal" className="text-[var(--cjp-text-muted)]" />
          GitHub
        </button>
      </div>
    </AuthSplitLayout>
  );
}
