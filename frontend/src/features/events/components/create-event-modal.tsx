import { FormEvent, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ApiClientError } from "@/lib/api/client";
import { createEventRequest } from "@/lib/api/events";
import { EVENT_TYPE_OPTIONS } from "@/lib/catalog-display";

type CreateEventModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function CreateEventModal({ open, onClose, onCreated }: CreateEventModalProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const date = String(form.get("date") ?? "");
    const time = String(form.get("time") ?? "09:00");
    const startAt = new Date(`${date}T${time}`);

    if (Number.isNaN(startAt.getTime())) {
      setErrorMessage("Date ou heure invalide");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await createEventRequest({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        type: String(form.get("type") ?? "FORMATION"),
        location: String(form.get("location") ?? "").trim(),
        maxPlaces: Number(form.get("maxPlaces") ?? 50),
        posterUrl: String(form.get("posterUrl") ?? "").trim() || undefined,
        startAt: startAt.toISOString(),
        published: true,
      });
      onCreated?.();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof ApiClientError ? error.message : "Création impossible");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Fermer la modale"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-dark)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--cjp-border)] p-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--cjp-white)]">Créer un nouvel événement</h2>
            <p className="text-sm text-[var(--cjp-text-muted)]">
              Organisez un atelier, hackathon ou conférence CJP.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--cjp-text-muted)] transition-colors hover:bg-[var(--cjp-gray)]"
            aria-label="Fermer"
          >
            <Icon name="close" />
          </button>
        </div>

        <form className="grid grid-cols-2 gap-4 p-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="col-span-2 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          <div className="col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Titre
            </label>
            <input
              name="title"
              required
              placeholder="Hackathon CJP 2026"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Date
            </label>
            <input
              name="date"
              required
              type="date"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Heure
            </label>
            <input
              name="time"
              required
              type="time"
              defaultValue="09:00"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Lieu
            </label>
            <input
              name="location"
              placeholder="Salle labo CJP"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Capacité
            </label>
            <input
              name="maxPlaces"
              type="number"
              min={1}
              defaultValue={50}
              required
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Type
            </label>
            <select
              name="type"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            >
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              URL affiche (optionnel)
            </label>
            <input
              name="posterUrl"
              placeholder="/brand/events/cjp-forum-web.jpg"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-3 border-t border-[var(--cjp-border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--cjp-gold)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-black)] disabled:opacity-50"
            >
              {submitting ? "Publication…" : "Publier l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
