import { ExternalLink, Heart, Clock, Download, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { ApiResource, ResourceLevel } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ResourceTypeIcon } from "./resource-type-icon";
import { useAuth } from "@/features/auth/auth-context";

type ResourceCardProps = {
  resource: ApiResource;
  onToggleFavorite?: (id: string) => void;
  className?: string;
};

const levelConfig: Record<ResourceLevel, { label: string; color: string }> = {
  DEBUTANT: { label: "Débutant", color: "border-green-500/30 text-green-400 bg-green-500/10" },
  INTERMEDIAIRE: { label: "Intermédiaire", color: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  AVANCE: { label: "Avancé", color: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

export function ResourceCard({ resource, onToggleFavorite, className }: ResourceCardProps) {
  const { user } = useAuth();
  const timeAgo = formatDistanceToNow(new Date(resource.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const level = levelConfig[resource.level] || levelConfig.DEBUTANT;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-gray)] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cjp-gold)]/40 hover:shadow-2xl hover:shadow-[var(--cjp-gold)]/5",
        className,
      )}
    >
      {/* Cover Image or Gradient */}
      <div className="relative h-40 w-full overflow-hidden bg-[var(--cjp-dark)]">
        {resource.coverUrl ? (
          <img
            src={resource.coverUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--cjp-black)] via-[var(--cjp-dark)] to-black/80" />
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md", level.color)}>
            {level.label}
          </span>
          <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {resource.category}
          </span>
        </div>

        {/* Favorite Button */}
        {user && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.(resource.id);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-110"
            title={resource.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", resource.isFavorite ? "fill-red-500 text-red-500" : "")}
            />
          </button>
        )}

        <div className="absolute bottom-3 right-3 opacity-90">
          <ResourceTypeIcon type={resource.type} className="h-8 w-8 shadow-lg backdrop-blur-md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-[var(--cjp-white)] group-hover:text-[var(--cjp-gold)] transition-colors">
          {resource.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-[var(--cjp-text-muted)]">
          {resource.description || "Aucune description fournie pour cette ressource."}
        </p>

        {resource.tags && resource.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="rounded-md bg-[var(--cjp-black)] px-2 py-0.5 text-xs text-gray-400">
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="rounded-md bg-[var(--cjp-black)] px-2 py-0.5 text-xs text-gray-500">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-[var(--cjp-text-muted)]">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-[var(--cjp-dark)] text-[10px] font-bold text-[var(--cjp-gold)] border border-[var(--cjp-border)]">
                {resource.uploadedBy.charAt(0).toUpperCase()}
              </span>
              {resource.author || resource.uploadedBy}
            </span>
            <span className="flex items-center gap-1 opacity-70">
              <Clock className="h-3 w-3" /> {timeAgo}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Vues">
              <Eye className="h-3.5 w-3.5" /> {resource.viewCount}
            </span>
            <span className="flex items-center gap-1" title="Favoris">
              <Heart className="h-3.5 w-3.5" /> {resource.favoriteCount}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Action Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--cjp-black)]/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
        <a
          href={resource.externalUrl || resource.fileUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex transform items-center gap-2 rounded-full bg-[var(--cjp-gold)] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-[var(--cjp-black)] shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-transform duration-300 hover:scale-105 hover:bg-[var(--cjp-gold-dark)] translate-y-4 group-hover:translate-y-0"
        >
          {resource.fileUrl ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
          Accéder
        </a>
      </div>
    </div>
  );
}
