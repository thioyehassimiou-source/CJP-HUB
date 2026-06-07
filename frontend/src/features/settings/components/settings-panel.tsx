import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { ToggleSwitch } from "@/features/settings/components/toggle-switch";
import {
  SETTINGS_FIELD_CLASS,
  SETTINGS_MEMBER,
  SETTINGS_NOTIFICATIONS,
  SETTINGS_PRIVACY,
  SETTINGS_PROFILE_AVATAR,
} from "@/features/settings/data/settings-data";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved";

export function SettingsPanel() {
  const [fullName, setFullName] = useState(SETTINGS_MEMBER.name);
  const [bio, setBio] = useState(SETTINGS_MEMBER.bio);
  const [privacy, setPrivacy] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS_PRIVACY.map((item) => [item.id, item.defaultOn])),
  );
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS_NOTIFICATIONS.map((item) => [item.id, item.defaultOn])),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleSave = () => {
    if (saveState !== "idle") return;
    setSaveState("saving");
    window.setTimeout(() => {
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 2000);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-xl grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="card-elevation relative flex flex-col items-center gap-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-lg md:flex-row lg:col-span-2">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-secondary/5" />
          <div className="relative">
            <img
              src={SETTINGS_PROFILE_AVATAR}
              alt={fullName}
              className="h-24 w-24 rounded-xl border-2 border-white object-cover shadow-md md:h-32 md:w-32"
            />
            <button
              type="button"
              className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105"
              aria-label="Modifier l'avatar"
            >
              <Icon name="edit" className="text-[18px]" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-headline-lg text-primary">{fullName}</h3>
            <p className="mb-md text-body-md text-on-surface-variant">{SETTINGS_MEMBER.role}</p>
            <div className="flex flex-wrap justify-center gap-sm md:justify-start">
              <span className="flex items-center gap-xs rounded-lg bg-secondary-container px-sm py-xs text-label-md text-on-secondary-container">
                <Icon name="verified" filled className="text-[16px]" />
                {SETTINGS_MEMBER.badge}
              </span>
              <span className="rounded-lg border border-outline-variant bg-surface-container px-sm py-xs text-label-md text-on-surface-variant">
                {SETTINGS_MEMBER.promotion}
              </span>
            </div>
          </div>
        </div>

        <div className="card-elevation relative flex flex-col justify-between overflow-hidden rounded-xl border border-primary/20 bg-primary-container p-lg text-on-primary-fixed">
          <div className="absolute top-0 right-0 p-lg opacity-10">
            <Icon name="badge" className="text-[80px]" />
          </div>
          <div>
            <p className="mb-xs text-label-md uppercase tracking-widest text-on-primary-container">
              Carte de Membre Digitale
            </p>
            <h4 className="text-headline-md text-white">ID: {SETTINGS_MEMBER.memberId}</h4>
          </div>
          <div className="mt-lg">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase text-on-primary-container">Expire le</p>
                <p className="font-bold text-secondary-fixed">{SETTINGS_MEMBER.expires}</p>
              </div>
              <div className="rounded-lg bg-white/10 p-sm backdrop-blur-sm">
                <Icon name="qr_code_2" className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-grid">
        <section className="card-elevation col-span-12 rounded-xl border border-outline-variant bg-surface-container-lowest p-lg lg:col-span-8">
          <div className="mb-lg flex items-center gap-md border-b border-outline-variant pb-md">
            <Icon name="person_edit" className="text-secondary" />
            <h3 className="text-headline-md">Informations du Profil</h3>
          </div>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <div className="space-y-sm">
              <label htmlFor="fullName" className="block text-label-md text-on-surface-variant">
                Nom Complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={SETTINGS_FIELD_CLASS}
              />
            </div>
            <div className="space-y-sm">
              <label htmlFor="email" className="block text-label-md text-on-surface-variant">
                Email Académique
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={SETTINGS_MEMBER.email}
                className="w-full cursor-not-allowed rounded-lg border border-outline-variant bg-surface-container-low px-md py-sm text-on-surface-variant outline-none"
              />
            </div>
            <div className="space-y-sm md:col-span-2">
              <label htmlFor="bio" className="block text-label-md text-on-surface-variant">
                Bio Professionnelle
              </label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className={SETTINGS_FIELD_CLASS}
              />
            </div>
          </div>
        </section>

        <section className="card-elevation col-span-12 rounded-xl border border-outline-variant bg-surface-container-lowest p-lg lg:col-span-4">
          <div className="mb-lg flex items-center gap-md border-b border-outline-variant pb-md">
            <Icon name="visibility" className="text-secondary" />
            <h3 className="text-headline-md">Confidentialité</h3>
          </div>
          <div className="space-y-md">
            {SETTINGS_PRIVACY.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-primary">{item.label}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.description}</p>
                </div>
                <ToggleSwitch
                  checked={privacy[item.id] ?? false}
                  onChange={(checked) =>
                    setPrivacy((current) => ({ ...current, [item.id]: checked }))
                  }
                  ariaLabel={item.label}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card-elevation col-span-12 rounded-xl border border-outline-variant bg-surface-container-lowest p-lg lg:col-span-6">
          <div className="mb-lg flex items-center gap-md border-b border-outline-variant pb-md">
            <Icon name="security" className="text-secondary" />
            <h3 className="text-headline-md">Sécurité</h3>
          </div>
          <div className="space-y-lg">
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-lg border border-outline-variant bg-surface p-md transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-md">
                <Icon name="lock_reset" className="text-on-surface-variant" />
                <div className="text-left">
                  <p className="text-label-md text-primary">Modifier le mot de passe</p>
                  <p className="text-[12px] text-on-surface-variant">Dernière modification il y a 3 mois</p>
                </div>
              </div>
              <Icon name="chevron_right" className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="rounded-lg border border-secondary/20 bg-secondary-container/10 p-md">
              <div className="flex items-start gap-md">
                <Icon name="verified_user" className="text-secondary" />
                <div className="flex-1">
                  <p className="text-label-md text-primary">Double Authentification (2FA)</p>
                  <p className="mb-md text-[12px] text-on-surface-variant">
                    Ajoutez une couche de sécurité supplémentaire à votre compte.
                  </p>
                  <span className="rounded bg-secondary px-sm py-xs text-[10px] font-bold text-white uppercase">
                    Activé
                  </span>
                </div>
                <button type="button" className="text-label-md font-bold text-secondary">
                  Gérer
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="card-elevation col-span-12 rounded-xl border border-outline-variant bg-surface-container-lowest p-lg lg:col-span-6">
          <div className="mb-lg flex items-center gap-md border-b border-outline-variant pb-md">
            <Icon name="notifications_active" className="text-secondary" />
            <h3 className="text-headline-md">Notifications</h3>
          </div>
          <div className="space-y-md">
            {SETTINGS_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-md rounded-lg p-sm transition-colors hover:bg-surface"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                  <Icon
                    name={item.icon}
                    filled={"filled" in item ? item.filled : false}
                    className="text-on-surface-variant"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-label-md text-primary">{item.label}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.id] ?? false}
                  onChange={(event) =>
                    setNotifications((current) => ({
                      ...current,
                      [item.id]: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-xl flex flex-col items-center justify-between gap-lg border-t border-outline-variant pt-lg md:flex-row">
        <Link
          to="/"
          className="flex items-center gap-sm rounded-lg px-lg py-sm text-label-md text-error transition-colors hover:bg-error/5"
        >
          <Icon name="logout" />
          Se déconnecter
        </Link>
        <div className="flex w-full items-center gap-md md:w-auto">
          <button
            type="button"
            className="flex-1 rounded-lg border border-outline-variant px-xl py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container md:flex-none"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={saveState !== "idle"}
            onClick={handleSave}
            className={cn(
              "flex-1 rounded-lg px-xl py-sm text-label-md text-on-secondary shadow-md transition-all active:scale-95 md:flex-none",
              saveState === "saved" ? "bg-secondary-fixed-dim" : "bg-secondary hover:opacity-90",
              saveState === "saving" && "opacity-90",
            )}
          >
            {saveState === "saving"
              ? "Enregistrement..."
              : saveState === "saved"
                ? "Modifications enregistrées !"
                : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
