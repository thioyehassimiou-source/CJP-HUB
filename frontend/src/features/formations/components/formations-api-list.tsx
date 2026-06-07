import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { createFormationRequest, fetchFormations } from "@/lib/api/formations";
import type { ApiFormation } from "@/lib/api/types";
import {
  FORMATION_LEVELS,
  FORMATION_PROGRAMS,
  formatPublishedDate,
  getFormationImage,
} from "@/lib/catalog-display";

export function FormationsApiList() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMINISTRATEUR" || user?.role === "FORMATEUR";
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFormations = () => {
    setLoading(true);
    fetchFormations(canManage)
      .then(({ formations: data }) => setFormations(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger le catalogue",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFormations();
  }, [canManage]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrorMessage("");

    try {
      await createFormationRequest({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        level: String(form.get("level") ?? "").trim(),
        program: String(form.get("program") ?? "").trim(),
        published: form.get("published") === "on",
      });
      setShowForm(false);
      loadFormations();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Création impossible",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {canManage ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--cjp-text-muted)]">
            {formations.length} formation{formations.length > 1 ? "s" : ""} dans le catalogue
          </p>
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-full border border-[var(--cjp-gold)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)] hover:text-[var(--cjp-black)]"
          >
            {showForm ? "Fermer" : "Nouvelle formation"}
          </button>
        </div>
      ) : null}

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="cjp-card-dark grid gap-4 p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Titre
            </label>
            <input name="title" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm" />
          </div>
          <div className="md:col-span-2">
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
              Niveau
            </label>
            <select name="level" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm">
              {FORMATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Programme
            </label>
            <select name="program" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm">
              {FORMATION_PROGRAMS.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--cjp-text-muted)] md:col-span-2">
            <input type="checkbox" name="published" defaultChecked className="accent-[var(--cjp-gold)]" />
            Publier immédiatement
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--cjp-gold)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-black)] disabled:opacity-50"
            >
              {submitting ? "Enregistrement…" : "Créer la formation"}
            </button>
          </div>
        </form>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="cjp-card-dark h-48 animate-pulse" />
          ))}
        </div>
      ) : null}

      {!loading && formations.length === 0 ? (
        <p className="cjp-card-dark p-8 text-center text-sm text-[var(--cjp-text-muted)]">
          Aucune formation disponible pour le moment.
        </p>
      ) : null}

      {!loading && formations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {formations.map((formation) => (
            <article key={formation.id} className="cjp-card-dark overflow-hidden">
              <div className="relative h-40">
                <img
                  src={getFormationImage(formation.program)}
                  alt=""
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute left-4 top-4">
                  <span className="cjp-badge-gold">{formation.program}</span>
                </div>
                {!formation.published ? (
                  <div className="absolute right-4 top-4 rounded-full bg-[var(--cjp-black)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
                    Brouillon
                  </div>
                ) : null}
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-xl font-bold text-[var(--cjp-white)]">{formation.title}</h3>
                <p className="line-clamp-2 text-sm text-[var(--cjp-text-muted)]">{formation.description}</p>
                <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wider text-[var(--cjp-text-muted)]">
                  <span>{formation.level}</span>
                  <span>Ajoutée le {formatPublishedDate(formation.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
