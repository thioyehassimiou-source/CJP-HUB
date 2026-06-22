import { FormEvent, useEffect, useState } from "react";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import {
  createResourceRequest,
  fetchResources,
  toggleFavoriteResource,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,

  type ResourceFilters,
} from "@/lib/api/resources";
import type { ApiResource, ResourceLevel, ResourceType } from "@/lib/api/types";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import { CjpButton } from "@/components/cjp/cjp-button";
import { ResourceCard } from "./resource-card";

export function LibraryApiDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<ResourceFilters>({
    category: "",
    type: "",
    level: "",
    search: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const canUpload = user?.role === "ADMINISTRATEUR" || user?.role === "FORMATEUR" || user?.membership?.status === "ACTIVE";

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search || "");
    }, 400);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const loadResources = () => {
    setLoading(true);
    setErrorMessage("");

    fetchResources({
      category: filters.category || undefined,
      type: filters.type || undefined,
      level: filters.level || undefined,
      search: debouncedSearch || undefined,
    })
      .then(({ resources: data }) => setResources(data))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger la bibliothèque",
        );
      })
      .finally(() => setLoading(false));
  };

  // Reload when filters (excluding active typing search) change
  useEffect(() => {
    loadResources();
  }, [filters.category, filters.type, filters.level, debouncedSearch]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;
    try {
      // Optimistic update
      setResources((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                isFavorite: !r.isFavorite,
                favoriteCount: r.isFavorite ? r.favoriteCount - 1 : r.favoriteCount + 1,
              }
            : r
        )
      );

      const res = await toggleFavoriteResource(id);
      
      // Update with server truth
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isFavorite: res.isFavorite, favoriteCount: res.favoriteCount } : r))
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris", error);
      // Revert optimistic update by reloading
      loadResources();
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !canUpload) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrorMessage("");

    try {
      const tagsString = String(form.get("tags") ?? "");
      const tags = tagsString ? tagsString.split(",").map((t) => t.trim()).filter(Boolean) : [];

      await createResourceRequest({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        type: String(form.get("type")) as ResourceType,
        category: String(form.get("category")),
        level: String(form.get("level")) as ResourceLevel,
        externalUrl: String(form.get("externalUrl") ?? "").trim() || undefined,
        fileUrl: String(form.get("fileUrl") ?? "").trim() || undefined,
        coverUrl: String(form.get("coverUrl") ?? "").trim() || undefined,
        author: String(form.get("author") ?? "").trim() || undefined,
        tags,
      });
      setShowForm(false);
      loadResources();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Importation impossible",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <CjpReveal>
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-dark)] p-4 shadow-lg md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            
            {/* Main Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-[var(--cjp-text-muted)]" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre, description, tags ou auteur..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="block w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] p-3 pl-12 text-sm text-[var(--cjp-white)] transition-colors placeholder:text-[var(--cjp-text-muted)] focus:border-[var(--cjp-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--cjp-gold)]"
              />
            </div>

            {/* Quick Actions / New Button */}
            {canUpload && (
              <div className="flex shrink-0 gap-2">
                <CjpButton
                  type="button"
                  variant={showForm ? "outline" : "primary"}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Annuler l'ajout" : "+ Nouvelle Ressource"}
                </CjpButton>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-[var(--cjp-border)]" />

          {/* Filters Dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--cjp-text-muted)]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtres :</span>
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-2 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {RESOURCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-2 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
            >
              <option value="">Tous les formats</option>
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-2 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
            >
              <option value="">Tous les niveaux</option>
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
            </select>
          </div>
        </div>
      </CjpReveal>

      {/* Error Message */}
      {errorMessage && (
        <CjpReveal>
          <p className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </p>
        </CjpReveal>
      )}

      {/* Creation Form */}
      {showForm && canUpload && (
        <CjpReveal>
          <form onSubmit={handleCreate} className="rounded-xl border border-[var(--cjp-gold)]/30 bg-[var(--cjp-dark)]/80 p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BookOpen className="w-32 h-32" />
            </div>
            
            <h3 className="mb-6 text-xl font-bold text-[var(--cjp-white)]">Ajouter une ressource pédagogique</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Titre de la ressource <span className="text-red-500">*</span>
                </label>
                <input name="title" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Format <span className="text-red-500">*</span>
                </label>
                <select name="type" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none">
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select name="category" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none">
                  {RESOURCE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Niveau de difficulté <span className="text-red-500">*</span>
                </label>
                <select name="level" required className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none">
                  <option value="DEBUTANT">Débutant</option>
                  <option value="INTERMEDIAIRE">Intermédiaire</option>
                  <option value="AVANCE">Avancé</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Auteur (Original)
                </label>
                <input name="author" placeholder="Nom de l'auteur, formateur, etc." className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="De quoi parle cette ressource ?"
                  className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                  Mots-clés (Tags)
                </label>
                <input name="tags" placeholder="React, API, Débutant, Tutoriel (séparés par des virgules)" className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
              </div>

              <div className="md:col-span-2 border-t border-[var(--cjp-border)] pt-6">
                <h4 className="text-sm font-bold text-[var(--cjp-white)] mb-4">Liens & Médias</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                      Image de Couverture (URL)
                    </label>
                    <input name="coverUrl" type="url" placeholder="https://..." className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                      Lien direct du Fichier
                    </label>
                    <input name="fileUrl" type="url" placeholder="https://..." className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                      Lien Externe (Youtube, Github...)
                    </label>
                    <input name="externalUrl" type="url" placeholder="https://..." className="w-full rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-sm text-[var(--cjp-white)] focus:border-[var(--cjp-gold)] focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <CjpButton type="submit" disabled={submitting}>
                  {submitting ? "Publication en cours..." : "Publier la ressource"}
                </CjpButton>
              </div>
            </div>
          </form>
        </CjpReveal>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 w-full animate-pulse rounded-xl bg-[var(--cjp-dark)] border border-[var(--cjp-border)]" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        /* Empty State */
        <CjpReveal delay={100}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "1rem", border: "1px solid var(--cjp-border)", background: "rgba(0,0,0,0.3)", padding: "3rem 2rem", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }}>
            <div style={{ marginBottom: "1rem", display: "flex", height: "5rem", width: "5rem", alignItems: "center", justifyContent: "center", borderRadius: "9999px", background: "var(--cjp-dark)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <BookOpen style={{ height: "2.5rem", width: "2.5rem", color: "var(--cjp-text-muted)" }} />
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--cjp-white)", marginBottom: "0.5rem" }}>Aucune ressource trouvée</p>
              <p style={{ fontSize: "0.875rem", color: "var(--cjp-text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                Modifiez vos filtres ou effectuez une autre recherche pour trouver du contenu pédagogique.
              </p>
              {(filters.category || filters.search || filters.level || filters.type) && (
                <button
                  onClick={() => setFilters({ category: "", type: "", level: "", search: "" })}
                  style={{ marginTop: "1.5rem", color: "var(--cjp-gold)", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </CjpReveal>
      ) : (
        /* Resources Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((resource, index) => (
            <CjpReveal key={resource.id} delay={index * 50}>
              <ResourceCard 
                resource={resource} 
                onToggleFavorite={handleToggleFavorite}
                className="h-[380px]"
              />
            </CjpReveal>
          ))}
        </div>
      )}
    </div>
  );
}
