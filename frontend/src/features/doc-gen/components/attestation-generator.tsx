

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  MEMBERS,
  TRAININGS,
} from "@/features/doc-gen/data/attestation-data";
import { cn } from "@/lib/utils";
import { CertificatePreview } from "./certificate-preview";
import { exportCertificateToPDF } from "./certificate-pdf-exporter";

type ActionState = "idle" | "loading" | "done";


function ActionButton({
  label,
  icon,
  variant = "secondary",
  onClick,
}: {
  label: string;
  icon: string;
  variant?: "primary" | "secondary";
  onClick: () => void | Promise<void>;
}) {
  const [state, setState] = useState<ActionState>("idle");

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("loading");
    try {
      await onClick();
      setState("done");
    } catch (error) {
      console.error(error);
      setState("idle");
    } finally {
      window.setTimeout(() => setState("idle"), 2000);
    }
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
                  onClick={async () => {
                    await exportCertificateToPDF({
                      memberName,
                      training,
                      issueDate,
                    });
                  }}
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

            <div className={cn("flex w-full justify-center", pulsePreview && "scale-[1.01] transition-transform duration-200")}>
              <div className="w-full max-w-[600px] origin-top md:scale-[0.8] lg:scale-100">
                <CertificatePreview
                  memberName={memberName}
                  training={training}
                  issueDate={issueDate}
                />
              </div>
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
