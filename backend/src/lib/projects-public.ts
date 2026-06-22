import type { Project, ProjectMember, ProjectStatus, Resource, User } from "@prisma/client";

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé",
};

export function parseTechnologies(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toPublicProject(
  project: Project & {
    members: Array<
      ProjectMember & {
        user: Pick<User, "id" | "firstName" | "lastName">;
      }
    >;
  },
) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    technologies: parseTechnologies(project.technologies),
    githubUrl: project.githubUrl,
    screenshots: project.screenshots,
    status: project.status,
    statusLabel: PROJECT_STATUS_LABELS[project.status],
    members: project.members.map((member) => ({
      id: member.user.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      role: member.role,
      initials: `${member.user.firstName[0] ?? ""}${member.user.lastName[0] ?? ""}`.toUpperCase(),
    })),
    createdAt: project.createdAt.toISOString(),
  };
}

export function toPublicResource(
  resource: Resource & {
    uploadedBy: Pick<User, "firstName" | "lastName">;
  },
  userId?: string,
  userFavorites?: Set<string>,
) {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    type: resource.type,
    category: resource.category,
    subCategory: resource.subCategory,
    author: resource.author,
    fileUrl: resource.fileUrl,
    externalUrl: resource.externalUrl,
    coverUrl: resource.coverUrl,
    level: resource.level,
    tags: resource.tags,
    viewCount: resource.viewCount,
    favoriteCount: resource.favoriteCount,
    isFavorite: userFavorites ? userFavorites.has(resource.id) : false,
    uploadedBy: `${resource.uploadedBy.firstName} ${resource.uploadedBy.lastName}`,
    createdAt: resource.createdAt.toISOString(),
  };
}

export function isValidProjectStatus(value: string): value is ProjectStatus {
  return ["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].includes(value);
}
