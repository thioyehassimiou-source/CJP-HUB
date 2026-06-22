import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, Save, User } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { updatePasswordRequest, updateProfileRequest } from "@/lib/api/auth";
import { fetchMonHeritage, updateLegacyBio } from "@/lib/api/members";
import { ApiClientError } from "@/lib/api/client";
import { ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved";

const FIELD_CLASS =
  "w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 text-sm text-[var(--cjp-white)] outline-none transition-colors focus:border-[var(--cjp-gold)]";

function membershipLabel(status: string | undefined) {
  switch (status) {
    case "ACTIVE":
      return "Membre actif";
    case "PENDING":
      return "Inscription en attente";
    case "REJECTED":
      return "Inscription refusée";
    default:
      return "Membre";
  }
}

export function CjpSettingsPanel() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileState, setProfileState] = useState<SaveState>("idle");
  const [passwordState, setPasswordState] = useState<SaveState>("idle");
  const [legacyBio, setLegacyBio] = useState("");
  const [heritageEligible, setHeritageEligible] = useState(false);
  const [heritageState, setHeritageState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone);
    setBio(user.bio ?? "");
    
    fetchMonHeritage()
      .then((data) => {
        setHeritageEligible(data.eligible);
        if (data.legacyBio) setLegacyBio(data.legacyBio);
      })
      .catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <p className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
        Connectez-vous pour gérer votre profil.
      </p>
    );
  }

  const handleProfileSave = async (event: FormEvent) => {
    event.preventDefault();
    if (profileState !== "idle") return;

    setProfileState("saving");
    setErrorMessage("");

    try {
      await updateProfileRequest({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });
      await refreshUser();
      setProfileState("saved");
      window.setTimeout(() => setProfileState("idle"), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Enregistrement impossible",
      );
      setProfileState("idle");
    }
  };

  const handlePasswordSave = async (event: FormEvent) => {
    event.preventDefault();
    if (passwordState !== "idle") return;

    setPasswordState("saving");
    setErrorMessage("");

    try {
      await updatePasswordRequest({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordState("saved");
      window.setTimeout(() => setPasswordState("idle"), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Modification impossible",
      );
      setPasswordState("idle");
    }
  };

  const handleHeritageSave = async (event: FormEvent) => {
    event.preventDefault();
    if (heritageState !== "idle") return;

    setHeritageState("saving");
    setErrorMessage("");

    try {
      await updateLegacyBio(legacyBio);
      setHeritageState("saved");
      window.setTimeout(() => setHeritageState("idle"), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Modification impossible",
      );
      setHeritageState("idle");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <div className="space-y-8">
      {errorMessage ? (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="cjp-card-dark p-6 lg:col-span-2">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-3xl font-bold text-[var(--cjp-black)]">
              {`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()}
            </div>
            <div>
              <p className="cjp-label-gold mb-2">Profil membre</p>
              <h2 className="text-2xl font-bold text-[var(--cjp-white)]">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 text-sm text-[var(--cjp-text-muted)]">
                {ROLE_LABELS[user.role]} · {membershipLabel(user.membership?.status)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="cjp-badge-gold">{user.filiere}</span>
                <span className="rounded-full border border-[var(--cjp-border)] px-3 py-1 text-xs text-[var(--cjp-text-muted)]">
                  {user.niveau}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="cjp-card-dark p-6">
          <p className="cjp-label-gold mb-2">Carte membre</p>
          <p className="text-sm text-[var(--cjp-text-muted)]">Identifiant CJP</p>
          <p className="mt-1 text-2xl font-bold text-[var(--cjp-gold)]">
            {user.membership?.memberId ?? "En attente"}
          </p>
          <p className="mt-4 text-xs text-[var(--cjp-text-muted)]">
            Année académique {user.membership?.academicYear ?? "—"}
          </p>
          <p className="mt-1 font-mono text-xs text-[var(--cjp-text-muted)]">{user.matricule}</p>
        </div>
      </div>

      <form onSubmit={handleProfileSave} className="cjp-card-dark space-y-6 p-6">
        <div className="flex items-center gap-3 border-b border-[var(--cjp-border)] pb-4">
          <User className="h-5 w-5 text-[var(--cjp-gold)]" />
          <h3 className="text-lg font-bold text-[var(--cjp-white)]">Informations du profil</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Prénom
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={FIELD_CLASS}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Nom
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={FIELD_CLASS}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              E-mail
            </label>
            <input id="email" value={user.email} disabled className={`${FIELD_CLASS} cursor-not-allowed opacity-60`} />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Téléphone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={FIELD_CLASS}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className={FIELD_CLASS}
              placeholder="Présentez votre parcours, vos compétences ou vos projets au club…"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={profileState !== "idle"}
            className={cn(
              "btn-cjp inline-flex items-center gap-2 !py-3 !text-xs",
              profileState === "saved" && "!bg-[var(--cjp-gold-dark)]",
            )}
          >
            <Save className="h-4 w-4" />
            {profileState === "saving"
              ? "Enregistrement…"
              : profileState === "saved"
                ? "Profil enregistré"
                : "Enregistrer le profil"}
          </button>
        </div>
      </form>

      {heritageEligible && (
        <form onSubmit={handleHeritageSave} className="cjp-card-dark space-y-6 p-6">
          <div className="flex items-center gap-3 border-b border-[var(--cjp-border)] pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-xs font-bold text-[var(--cjp-black)]">
              H
            </span>
            <h3 className="text-lg font-bold text-[var(--cjp-white)]">Mon Héritage CJP</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-[var(--cjp-text-muted)]">
              En tant qu'ancien membre du bureau, vous pouvez mettre à jour votre biographie historique qui apparaîtra sur la page <strong className="text-[var(--cjp-gold)]">À propos</strong> dans la section <strong className="text-[var(--cjp-gold)]">Notre Héritage</strong>. Partagez ce que vous êtes devenu !
            </p>
            <div className="space-y-2">
              <label htmlFor="legacyBio" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
                Biographie Historique
              </label>
              <textarea
                id="legacyBio"
                rows={4}
                value={legacyBio}
                onChange={(event) => setLegacyBio(event.target.value)}
                className={FIELD_CLASS}
                placeholder="Ex: Ingénieur Logiciel chez TechCorp. Fier d'avoir contribué à l'organisation du premier Hackathon du CJP..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={heritageState !== "idle"}
              className={cn(
                "btn-cjp inline-flex items-center gap-2 !py-3 !text-xs",
                heritageState === "saved" && "!bg-[var(--cjp-gold-dark)]",
              )}
            >
              <Save className="h-4 w-4" />
              {heritageState === "saving"
                ? "Enregistrement…"
                : heritageState === "saved"
                  ? "Héritage enregistré"
                  : "Mettre à jour mon héritage"}
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handlePasswordSave} className="cjp-card-dark space-y-6 p-6">
        <div className="flex items-center gap-3 border-b border-[var(--cjp-border)] pb-4">
          <Lock className="h-5 w-5 text-[var(--cjp-gold)]" />
          <h3 className="text-lg font-bold text-[var(--cjp-white)]">Sécurité</h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={FIELD_CLASS}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={FIELD_CLASS}
              autoComplete="new-password"
              minLength={6}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={passwordState !== "idle" || !currentPassword || !newPassword}
            className={cn(
              "rounded-lg border border-[var(--cjp-border)] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-white)] transition-colors hover:border-[var(--cjp-gold)] hover:text-[var(--cjp-gold)]",
              passwordState === "saved" && "border-[var(--cjp-gold)] text-[var(--cjp-gold)]",
            )}
          >
            {passwordState === "saving"
              ? "Modification…"
              : passwordState === "saved"
                ? "Mot de passe modifié"
                : "Modifier le mot de passe"}
          </button>
        </div>
      </form>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
