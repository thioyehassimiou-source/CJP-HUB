

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  ACCENT_COLORS,
  POSTER_BACKGROUND,
  POSTER_EVENTS,
  POSTER_TEMPLATES,
  type PosterEventId,
  type PosterTemplate,
} from "@/features/doc-gen/data/poster-data";
import { cn } from "@/lib/utils";

type ActionState = "idle" | "loading" | "done";

function PosterPreview({
  event,
  template,
  accentColor,
  backgroundUrl,
  titleAnimating,
}: {
  event: (typeof POSTER_EVENTS)[number];
  template: PosterTemplate;
  accentColor: string;
  backgroundUrl: string;
  titleAnimating: boolean;
}) {
  const titleClassName = {
    modern: "text-display-lg text-[48px] font-black uppercase italic leading-tight",
    classic: "text-headline-lg text-[42px] font-bold leading-snug border-l-4 pl-md",
    hackathon:
      "bg-white/10 px-sm font-mono text-[36px] font-bold uppercase tracking-widest",
  }[template];

  return (
    <div
      className={cn(
        "poster-preview-shadow relative flex h-[800px] w-[450px] flex-col overflow-hidden bg-white transition-all duration-500",
        template === "modern" ? "rounded-xl" : "rounded-sm",
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover opacity-10 blur-[2px]"
          src={backgroundUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/90 via-transparent to-primary-container/95" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-xl text-white">
        <div className="flex items-start justify-between">
          <div className="rounded p-md" style={{ backgroundColor: accentColor }}>
            <h3 className="text-headline-lg font-black tracking-tighter text-white">CJP</h3>
          </div>
          <div className="text-right">
            <p className="text-label-md tracking-widest" style={{ color: accentColor }}>
              SESSION 2026
            </p>
            <p className="text-label-md opacity-80">{event.tagline}</p>
          </div>
        </div>

        <div className="mb-xl mt-auto">
          <div className="mb-md h-2 w-16" style={{ backgroundColor: accentColor }} />
          <h2
            className={cn(
              titleClassName,
              "transition-all duration-300 ease-out",
              titleAnimating && "translate-y-2 opacity-0",
              !titleAnimating && "translate-y-0 opacity-100",
              template === "classic" && "border-secondary",
            )}
            style={{
              ...(template === "classic" ? { borderColor: accentColor } : {}),
              ...(template === "hackathon" ? { color: accentColor } : {}),
            }}
          >
            {event.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-lg rounded-xl border border-white/10 bg-white/5 p-lg backdrop-blur-md">
          <div>
            <p className="mb-xs text-label-md" style={{ color: accentColor }}>
              DATE ET HEURE
            </p>
            <p className="text-headline-md">{event.date}</p>
            <p className="text-body-md opacity-80">À PARTIR DE 09:00</p>
          </div>
          <div>
            <p className="mb-xs text-label-md" style={{ color: accentColor }}>
              LIEU
            </p>
            <p className="text-headline-md">{event.venue}</p>
            <p className="text-body-md opacity-80">LABORATOIRE CJP</p>
          </div>
          <div className="col-span-2">
            <p className="mb-xs text-label-md" style={{ color: accentColor }}>
              FORMATEUR / INTERVENANT
            </p>
            <div className="flex items-center gap-md">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accentColor}33` }}
              >
                <Icon name="person" className="text-secondary-fixed" style={{ color: accentColor }} />
              </div>
              <p className="text-headline-md">{event.speaker}</p>
            </div>
          </div>
        </div>

        <div className="mt-xl flex items-center justify-between border-t border-white/10 pt-lg">
          <div className="flex gap-md">
            <Icon name="qr_code_2" style={{ color: accentColor }} />
            <p className="self-center text-label-md">SCAN TO REGISTER</p>
          </div>
          <p className="font-mono text-code-sm" style={{ color: accentColor }}>
            WWW.CJPHUB.ORG
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  variant,
  onClick,
}: {
  label: string;
  icon: string;
  variant: "primary" | "whatsapp";
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
        "flex w-full items-center justify-center gap-md rounded-lg py-md text-headline-md transition-all active:scale-[0.98] disabled:opacity-80",
        variant === "primary"
          ? "bg-primary text-white hover:opacity-90"
          : "border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5",
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
          <Icon name={icon} />
          {label}
        </>
      )}
    </button>
  );
}

export function PosterDesigner() {
  const [eventId, setEventId] = useState<PosterEventId>("hackathon-2024");
  const [template, setTemplate] = useState<PosterTemplate>("modern");
  const [accentColor, setAccentColor] = useState<string>(ACCENT_COLORS[0].value);
  const [backgroundUrl, setBackgroundUrl] = useState(POSTER_BACKGROUND);
  const [titleAnimating, setTitleAnimating] = useState(false);

  const event = POSTER_EVENTS.find((item) => item.id === eventId) ?? POSTER_EVENTS[0];

  const handleEventChange = (nextId: PosterEventId) => {
    setEventId(nextId);
    setTitleAnimating(true);
    window.setTimeout(() => setTitleAnimating(false), 400);
  };

  const handleBackgroundUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBackgroundUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-1 flex-col gap-xl md:flex-row md:items-start">
      <section className="w-full space-y-lg md:w-1/3">
        <div className="space-y-lg rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
          <h2 className="text-headline-md">Configuration</h2>

          <div className="space-y-sm">
            <label className="text-label-md text-on-surface-variant">SÉLECTIONNER L&apos;ÉVÉNEMENT</label>
            <select
              value={eventId}
              onChange={(event) => handleEventChange(event.target.value as PosterEventId)}
              className="w-full rounded-lg border border-outline-variant bg-surface p-md font-body-md outline-none focus:border-secondary"
            >
              {POSTER_EVENTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-sm">
            <label className="text-label-md text-on-surface-variant">MODÈLE VISUEL</label>
            <div className="grid grid-cols-3 gap-sm">
              {POSTER_TEMPLATES.map((item) => {
                const active = template === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTemplate(item.id)}
                    className={cn(
                      "rounded-lg p-sm text-center transition-all",
                      active
                        ? "border-2 border-secondary bg-secondary-container/10"
                        : "border border-outline-variant hover:border-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-label-md",
                        active ? "text-secondary" : "text-on-surface-variant",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-sm">
            <label className="text-label-md text-on-surface-variant">COULEUR D&apos;ACCENTUATION</label>
            <div className="flex gap-md">
              {ACCENT_COLORS.map((color) => {
                const active = accentColor === color.value;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    aria-label={`Couleur ${color.id}`}
                    className={cn(
                      "h-10 w-10 rounded-full border-4 border-white shadow-sm",
                      active ? "ring-2 ring-secondary" : "ring-1 ring-outline-variant",
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-sm">
            <label className="text-label-md text-on-surface-variant">IMAGE DE FOND (OPTIONNEL)</label>
            <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant transition-colors hover:bg-surface">
              <Icon name="cloud_upload" className="text-outline" />
              <p className="text-label-md text-outline">Glisser ou cliquer</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleBackgroundUpload(event.target.files?.[0])}
              />
            </label>
          </div>

          <div className="space-y-sm pt-md">
            <ActionButton
              label="Télécharger (PNG/PDF)"
              icon="download"
              variant="primary"
              onClick={() => undefined}
            />
            <ActionButton
              label="Partager sur WhatsApp"
              icon="share"
              variant="whatsapp"
              onClick={() => undefined}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-1 justify-center">
        <PosterPreview
          event={event}
          template={template}
          accentColor={accentColor}
          backgroundUrl={backgroundUrl}
          titleAnimating={titleAnimating}
        />
      </section>
    </div>
  );
}
