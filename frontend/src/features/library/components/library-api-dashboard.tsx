import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import {
  createResourceRequest,
  fetchResources,
  RESOURCE_CATEGORIES,
} from "@/lib/api/resources";
import type { ApiResource } from "@/lib/api/types";
import { formatFinanceDate } from "@/lib/finance-display";

export function LibraryApiDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadResources = () => {
    setLoading(true);
    setErrorMessage("");

    fetchResources()
      .then(({ resources: data }) => setResources(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger la bibliothèque",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    if (categoryFilter === "Toutes") return resources;
    return resources.filter((resource) => resource.category === categoryFilter);
  }, [resources, categoryFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, ApiResource[]>();
    for (const resource of filteredResources) {
      const list = map.get(resource.category) ?? [];
      list.push(resource);
      map.set(resource.category, list);
    }
    return Array.from(map.entries());
  }, [filteredResources]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !user) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrorMessage("");

    try {
      await createResourceRequest({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        category: String(form.get("category") ?? "").trim(),
        externalUrl: String(form.get("externalUrl") ?? "").trim() || undefined,
        fileUrl: String(form.get("fileUrl") ?? "").trim() || undefined,
      });
      setShowForm(false);
      loadResources();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Import impossible",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="cjp-card-dark h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-dark)] px-4 py-2 text-sm text-[var(--cjp-white)]"
        >
          <option value="Toutes">Toutes les catégories</option>
          {RESOURCE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {user ? (
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-full border border-[var(--cjp-gold)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)] hover:text-[var(--cjp-black)]"
          >
            {showForm ? "Fermer" : "Importer une ressource"}
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      {showForm && user ? (
        <form onSubmit={handleCreate} className="cjp-card-dark grid gap-4 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Titre
            </label>
            <input name="title" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Catégorie
            </label>
            <select name="category" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm">
              {RESOURCE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Lien externe
            </label>
            <input
              name="externalUrl"
              type="url"
              placeholder="https://..."
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              URL fichier (optionnel)
            </label>
            <input
              name="fileUrl"
              placeholder="/brand/events/cjp-forum-web.jpg"
              className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[var(--cjp-gold)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-black)] disabled:opacity-50"
            >
              {submitting ? "Import…" : "Publier la ressource"}
            </button>
          </div>
        </form>
      ) : null}

      {grouped.length === 0 ? (
        <p className="cjp-card-dark p-8 text-center text-sm text-[var(--cjp-text-muted)]">
          Aucune ressource disponible pour le moment.
        </p>
      ) : (
        grouped.map(([category, items]) => (
          <section key={category}>
            <h3 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">{category}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((resource) => (
                <article key={resource.id} className="cjp-card-dark p-6">
                  <h4 className="text-lg font-bold text-[var(--cjp-white)]">{resource.title}</h4>
                  {resource.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--cjp-text-muted)]">
                      {resource.description}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--cjp-text-muted)]">
                    <span>Par {resource.uploadedBy}</span>
                    <span>{formatFinanceDate(resource.createdAt)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {resource.externalUrl ? (
                      <a
                        href={resource.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] hover:underline"
                      >
                        Ouvrir le lien
                      </a>
                    ) : null}
                    {resource.fileUrl ? (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] hover:underline"
                      >
                        Télécharger
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
