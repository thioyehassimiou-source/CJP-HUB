import {
  Book,
  BookOpen,
  FileText,
  Github,
  GraduationCap,
  MonitorPlay,
  Presentation,
  Users,
  Video,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { ResourceType } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ResourceTypeIconProps = {
  type: ResourceType;
  className?: string;
};

const iconMap: Record<ResourceType, LucideIcon> = {
  PDF: FileText,
  COURS: BookOpen,
  PRESENTATION: Presentation,
  VIDEO: Video,
  TUTORIEL: MonitorPlay,
  YOUTUBE: Youtube,
  COURSERA: GraduationCap,
  UDEMY: GraduationCap,
  GITHUB: Github,
  ARTICLE: FileText,
  DOCUMENTATION: Book,
  EBOOK: BookOpen,
  COMMUNAUTE: Users,
};

const colorMap: Record<ResourceType, string> = {
  PDF: "text-red-500 bg-red-500/10",
  COURS: "text-blue-500 bg-blue-500/10",
  PRESENTATION: "text-orange-500 bg-orange-500/10",
  VIDEO: "text-purple-500 bg-purple-500/10",
  TUTORIEL: "text-emerald-500 bg-emerald-500/10",
  YOUTUBE: "text-red-600 bg-red-600/10",
  COURSERA: "text-blue-600 bg-blue-600/10",
  UDEMY: "text-purple-600 bg-purple-600/10",
  GITHUB: "text-[var(--cjp-white)] bg-[var(--cjp-white)]/10",
  ARTICLE: "text-[var(--cjp-gold)] bg-[var(--cjp-gold)]/10",
  DOCUMENTATION: "text-cyan-500 bg-cyan-500/10",
  EBOOK: "text-amber-500 bg-amber-500/10",
  COMMUNAUTE: "text-pink-500 bg-pink-500/10",
};

export function ResourceTypeIcon({ type, className }: ResourceTypeIconProps) {
  const Icon = iconMap[type] || FileText;
  const colors = colorMap[type] || colorMap.ARTICLE;

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/5",
        colors,
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
