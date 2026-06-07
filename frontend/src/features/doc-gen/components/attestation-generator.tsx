

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  CERTIFICATE_QR,
  MEMBERS,
  SIGNATURE_IMAGE,
  TRAININGS,
} from "@/features/doc-gen/data/attestation-data";
import { cn } from "@/lib/utils";

type ActionState = "idle" | "loading" | "done";

function CertificatePreview({
  memberName,
  training,
  issueDate,
}: {
  memberName: string;
  training: string;
  issueDate: string;
}) {
  const formattedDate = new Date(issueDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="cert-shadow relative flex aspect-[1/1.414] w-full max-w-[600px] flex-col overflow-hidden rounded-sm border-[12px] border-primary bg-white">
      <div className="pointer-events-none absolute inset-4 border border-outline-variant/30" />
      <div className="pointer-events-none absolute inset-8 border-4 border-double border-primary/10" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#0f172a 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="flex items-start justify-between px-12 pt-16">
        <div className="flex items-center gap-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-white">
            <Icon name="school" className="text-[32px]" filled />
          </div>
          <div>
            <h5 className="text-xl font-bold leading-none tracking-tight text-primary">CJP HUB</h5>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Excellence académique
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-outline">REF: #AT-2026-05829</p>
          <p className="font-mono text-[10px] uppercase text-outline">DATE: {formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center space-y-lg px-16 text-center">
        <h4 className="font-serif text-[42px] italic leading-tight text-primary">
          Attestation de Réussite
        </h4>
        <div className="h-px w-24 bg-outline-variant" />
        <div className="space-y-sm">
          <p className="text-body-md text-on-surface-variant">Le comité académique certifie que</p>
          <h3 className="font-serif text-[32px] font-bold text-primary transition-transform duration-200">
            {memberName}
          </h3>
          <p className="text-body-md text-on-surface-variant">
            a validé avec succès l&apos;ensemble des modules de la formation
          </p>
          <h4 className="border-b border-secondary/20 bg-secondary-container/10 px-lg py-sm text-headline-md font-bold text-secondary transition-transform duration-200">
            {training}
          </h4>
        </div>
        <div className="h-px w-16 bg-outline-variant" />
        <p className="max-w-[400px] text-sm leading-relaxed text-on-surface-variant">
          Délivré en reconnaissance des compétences exceptionnelles démontrées lors du parcours
          pédagogique intensif du Club des Jeunes Programmeurs.
        </p>
      </div>

      <div className="flex items-end justify-between px-12 pb-16">
        <div className="space-y-md">
          <p className="text-[10px] font-bold uppercase text-primary">
            Signature du responsable
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Signature"
            className="h-12 w-32 object-contain opacity-80 mix-blend-multiply"
            src={SIGNATURE_IMAGE}
          />
          <p className="text-[11px] font-label-md">Directeur des Formations CJP</p>
        </div>
        <div className="flex flex-col items-center gap-xs">
          <div className="rounded-sm border border-outline-variant bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="QR Code de vérification" className="h-20 w-20" src={CERTIFICATE_QR} />
          </div>
          <p className="font-mono text-[8px] uppercase text-outline">Scannez pour vérifier</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  variant = "secondary",
  onClick,
}: {
  label: string;
  icon: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}) {
  const [state, setState] = useState<ActionState>("idle");

  const handleClick = () => {
    if (state !== "idle") return;
    setState("loading");
    onClick();
    window.setTimeout(() => {
      setState("done");
      window.setTimeout(() => setState("idle"), 2000);
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      className={cn(
        "flex items-center justify-center gap-sm rounded-lg text-label-md transition-all disabled:opacity-80",
        variant === "primary"
          ? "w-full bg-primary py-4 text-white shadow-md hover:shadow-lg active:scale-95"
          : "border border-outline-variant bg-surface-container-high py-3 text-primary hover:bg-surface-container",
      )}
    >
      {state === "loading" ? (
        <>
          <Icon name="sync" className="animate-spin" />
          Traitement...
        </>
      ) : state === "done" ? (
        <>
          <Icon name="check" />
          Terminé
        </>
      ) : (
        <>
          <Icon name={icon} className={variant === "secondary" ? "text-[20px]" : undefined} />
          {label}
        </>
      )}
    </button>
  );
}

export function AttestationGenerator() {
  const [memberName, setMemberName] = useState(MEMBERS[0]);
  const [training, setTraining] = useState(TRAININGS[0]);
  const [issueDate, setIssueDate] = useState("2026-05-20");
  const [pulsePreview, setPulsePreview] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-xl">
        <h2 className="mb-xs text-display-lg text-primary">Génération d&apos;Attestation</h2>
        <p className="text-body-lg text-on-surface-variant">
          Créez et validez les certificats de réussite pour les membres du club.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-xl lg:grid-cols-12">
        <div className="space-y-lg lg:col-span-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
            <h3 className="mb-lg flex items-center gap-sm text-headline-md">
              <Icon name="tune" className="text-secondary" />
              Paramètres
            </h3>

            <form className="space-y-md" onSubmit={(event) => event.preventDefault()}>
              <div>
                <label className="mb-xs block text-label-md text-on-surface-variant">
                  Sélectionner un membre
                </label>
                <div className="relative">
                  <select
                    value={memberName}
                    onChange={(event) => {
                      setMemberName(event.target.value);
                      setPulsePreview(true);
                      window.setTimeout(() => setPulsePreview(false), 200);
                    }}
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-low px-md py-3 outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary"
                  >
                    {MEMBERS.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="expand_more"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                  />
                </div>
              </div>

              <div>
                <label className="mb-xs block text-label-md text-on-surface-variant">
                  Formation suivie
                </label>
                <div className="relative">
                  <select
                    value={training}
                    onChange={(event) => {
                      setTraining(event.target.value);
                      setPulsePreview(true);
                      window.setTimeout(() => setPulsePreview(false), 200);
                    }}
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-low px-md py-3 outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary"
                  >
                    {TRAININGS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="expand_more"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                  />
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-secondary">
                  <Icon name="check_circle" className="text-[14px]" />
                  Statut : Terminée
                </p>
              </div>

              <div>
                <label className="mb-xs block text-label-md text-on-surface-variant">
                  Date de délivrance
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-md py-3 outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="border-t border-outline-variant pt-lg">
                <ActionButton
                  label="Générer le PDF"
                  icon="picture_as_pdf"
                  variant="primary"
                  onClick={() => undefined}
                />
                <div className="mt-md grid grid-cols-2 gap-sm">
                  <ActionButton label="Email" icon="mail" onClick={() => undefined} />
                  <ActionButton label="Portfolio" icon="save" onClick={() => undefined} />
                </div>
              </div>
            </form>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary-container p-lg text-on-primary-container">
            <Icon
              name="verified_user"
              className="absolute -bottom-4 -right-4 text-[120px] opacity-10 transition-transform group-hover:scale-110"
            />
            <h4 className="mb-sm text-headline-md text-white">Sécurité des diplômes</h4>
            <p className="mb-md text-body-md opacity-80">
              Chaque attestation générée comporte un QR Code unique enregistré dans le registre CJP
              pour garantir l&apos;authenticité.
            </p>
            <button
              type="button"
              className="flex items-center gap-xs text-label-md text-secondary-fixed hover:underline hover:underline-offset-4"
            >
              En savoir plus
              <Icon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center lg:col-span-8">
          <div className="sticky top-24 flex w-full flex-col items-center">
            <div className="mb-md flex w-full max-w-[600px] items-center justify-between text-on-surface-variant">
              <span className="text-label-md uppercase tracking-wider">Aperçu en temps réel</span>
              <div className="flex gap-sm">
                {["zoom_in", "zoom_out", "fullscreen"].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="rounded-lg p-2 hover:bg-surface-container"
                    aria-label={icon}
                  >
                    <Icon name={icon} />
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(pulsePreview && "scale-[1.01] transition-transform duration-200")}>
              <CertificatePreview
                memberName={memberName}
                training={training}
                issueDate={issueDate}
              />
            </div>

            <div className="mt-md flex flex-wrap justify-center gap-lg font-label-md text-outline">
              <span className="flex items-center gap-xs">
                <Icon name="description" className="text-[16px]" />
                A4 Portrait
              </span>
              <span className="flex items-center gap-xs">
                <Icon name="high_res" className="text-[16px]" />
                300 DPI Ready
              </span>
              <span className="flex items-center gap-xs">
                <Icon name="verified" className="text-[16px]" />
                ID Blockchain : 0x4B...829
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
