import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { CjpButton } from "@/components/cjp/cjp-button";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { useAuth } from "@/features/auth/auth-context";
import { Icon } from "@/components/ui/icon";
import {
  AUTH_INSCRIPTION_SLIDES,
  authFieldClass,
  authLabelClass,
  authLinkClass,
  authSubmitClass,
} from "@/lib/auth-data";
import { ApiClientError } from "@/lib/api/client";
import {
  MATRICULE_HINT,
  UNIVERSITE_LABE_FILIERES,
  UNIVERSITE_LABE_NIVEAUX,
  normalizeMatricule,
  validateRegistrationFields,
} from "@/lib/university-rules";

export function InscriptionPage() {
  const { register, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const form = new FormData(event.currentTarget);
    const payload = {
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      matricule: normalizeMatricule(String(form.get("matricule") ?? "")),
      filiere: String(form.get("filiere") ?? "").trim(),
      niveau: String(form.get("niveau") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    };

    const validationError = validateRegistrationFields(payload);
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await register(payload);
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Inscription impossible",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted && user) {
    return (
      <AuthSplitLayout
        wideForm
        title="Candidature envoyée"
        description="Votre pré-inscription a bien été enregistrée dans CJP Hub."
        slides={AUTH_INSCRIPTION_SLIDES}
      >
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--cjp-gold)_40%,#ddd)] bg-[color-mix(in_srgb,var(--cjp-gold)_8%,white)] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
              <Icon name="check_circle" className="text-2xl" />
            </div>
            <p className="font-semibold text-[var(--cjp-black)]">
              Bonjour {user.firstName}, votre dossier est en cours de validation.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cjp-black)]/70">
              Statut actuel : <strong>{user.membership?.status === "PENDING" ? "En attente" : user.membership?.status}</strong>.
              Le bureau exécutif du CJP examinera votre candidature avant l&apos;activation de
              votre carte membre. Vous pouvez déjà accéder à votre espace personnel.
            </p>
            <p className="mt-3 text-sm text-[var(--cjp-black)]/60">
              E-mail enregistré : <strong>{user.email}</strong>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CjpButton to="/dashboard" className="justify-center">
              ACCÉDER AU TABLEAU DE BORD
            </CjpButton>
            <CjpButton to="/" variant="outline" className="justify-center !text-[var(--cjp-black)]">
              RETOUR À L&apos;ACCUEIL
            </CjpButton>
          </div>

          <p className="text-center text-sm text-[var(--cjp-text-muted)]">
            Déjà inscrit sur un autre appareil ?{" "}
            <Link to="/connexion" className={authLinkClass}>
              Se connecter
            </Link>
          </p>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      wideForm
      title="Pré-inscription CJP"
      description="Remplissez le formulaire en ligne. Le bureau exécutif validera votre dossier avant activation de votre carte membre."
      slides={AUTH_INSCRIPTION_SLIDES}
      footer={
        <p className="mt-6 text-center text-sm text-[var(--cjp-text-muted)]">
          Déjà membre ?{" "}
          <Link to="/connexion" className={authLinkClass}>
            Se connecter
          </Link>
        </p>
      }
    >
      <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate={false}>
        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}

        <div>
          <label htmlFor="firstName" className={authLabelClass}>
            Prénom
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={authFieldClass} />
        </div>
        <div>
          <label htmlFor="lastName" className={authLabelClass}>
            Nom
          </label>
          <input id="lastName" name="lastName" required autoComplete="family-name" className={authFieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="matricule" className={authLabelClass}>
            Numéro de matricule
          </label>
          <input
            id="matricule"
            name="matricule"
            required
            maxLength={14}
            autoComplete="off"
            spellCheck={false}
            placeholder="THHA1512131516"
            pattern="[A-Za-z]{4}[0-9]{10}"
            title={MATRICULE_HINT}
            className={`${authFieldClass} uppercase tracking-wide`}
            onChange={(event) => {
              event.currentTarget.value = normalizeMatricule(event.currentTarget.value);
            }}
          />
          <p className="mt-1.5 text-xs text-[var(--cjp-text-muted)]">{MATRICULE_HINT}</p>
        </div>
        <div>
          <label htmlFor="filiere" className={authLabelClass}>
            Filière <span className="text-[var(--cjp-text-muted)]">(Université de Labé)</span>
          </label>
          <select id="filiere" name="filiere" required className={authFieldClass} defaultValue={UNIVERSITE_LABE_FILIERES[1]}>
            {UNIVERSITE_LABE_FILIERES.map((filiere) => (
              <option key={filiere} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="niveau" className={authLabelClass}>
            Niveau de licence
          </label>
          <select id="niveau" name="niveau" required className={authFieldClass} defaultValue={UNIVERSITE_LABE_NIVEAUX[0]}>
            {UNIVERSITE_LABE_NIVEAUX.map((niveau) => (
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="phone" className={authLabelClass}>
            Téléphone
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+224 6XX XX XX XX" className={authFieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={authLabelClass}>
            E-mail Gmail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="prenom.nom@gmail.com"
            pattern="[^\s@]+@gmail\.com"
            title="L'e-mail doit se terminer par @gmail.com"
            className={authFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="password" className={authLabelClass}>
            Mot de passe <span className="text-[var(--cjp-text-muted)]">(6 caractères minimum)</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={authFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className={authSubmitClass}>
            {loading ? "Envoi en cours…" : "Soumettre ma candidature"}
            {!loading ? (
              <span className="cjp-btn-arrow">
                <Icon name="arrow_forward" className="text-base" />
              </span>
            ) : null}
          </button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
