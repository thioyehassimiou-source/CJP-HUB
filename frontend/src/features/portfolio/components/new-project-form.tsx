import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { ApiClientError } from "@/lib/api/client";
import { createProjectRequest } from "@/lib/api/projects";
import {
  PROJECT_FORM_FIELD_CLASS,
  PROJECT_FORM_LABEL_CLASS,
  PROJECT_TECH_OPTIONS,
} from "@/features/portfolio/data/project-form-data";
import { cn } from "@/lib/utils";

type PreviewImage = {
  id: string;
  url: string;
};

type SubmitState = "idle" | "loading" | "success";

export function NewProjectForm() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const addTechnology = (value: string) => {
    if (!value || technologies.includes(value)) return;
    setTechnologies((current) => [...current, value]);
  };

  const removeTechnology = (tech: string) => {
    setTechnologies((current) => current.filter((item) => item !== tech));
  };

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        if (typeof url !== "string") return;
        setPreviews((current) => [
          ...current,
          { id: `${file.name}-${Date.now()}`, url },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (id: string) => {
    setPreviews((current) => current.filter((item) => item.id !== id));
  };

  const submitProject = async (asDraft: boolean) => {
    if (!formRef.current || submitState !== "idle") return;

    const form = new FormData(formRef.current);
    if (technologies.length === 0) {
      window.alert("Ajoutez au moins une technologie.");
      return;
    }

    setSubmitState("loading");

    try {
      await createProjectRequest({
        title: String(form.get("title") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        technologies,
        githubUrl: String(form.get("github") ?? "").trim() || undefined,
        status: asDraft ? "DRAFT" : "IN_PROGRESS",
      });
      setSubmitState("success");
      window.setTimeout(() => {
        navigate("/dashboard/projets");
      }, 1200);
    } catch (error) {
      setSubmitState("idle");
      window.alert(error instanceof ApiClientError ? error.message : "Publication impossible");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form
        ref={formRef}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        onSubmit={(event) => {
          event.preventDefault();
          submitProject(false);
        }}
      >
        <div className="space-y-8 lg:col-span-8">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-headline-md">
              <Icon name="edit_note" className="text-secondary" />
              Informations Générales
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className={PROJECT_FORM_LABEL_CLASS}>
                  Titre du Projet
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="ex: Système de Gestion de Bibliothèque"
                  className={PROJECT_FORM_FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="description" className={PROJECT_FORM_LABEL_CLASS}>
                  Description Détaillée
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Expliquez les objectifs, les défis rencontrés et votre approche..."
                  className={cn(PROJECT_FORM_FIELD_CLASS, "resize-none")}
                />
                <p className="mt-2 text-xs text-on-surface-variant">
                  Markdown supporté pour une mise en forme riche.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-headline-md">
              <Icon name="image" className="text-secondary" />
              Médias &amp; Démo
            </h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (event.dataTransfer.files.length > 0) {
                  handleFiles(event.dataTransfer.files);
                }
              }}
              className={cn(
                "group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-10 transition-colors hover:border-secondary hover:bg-secondary-container/5",
                isDragging && "border-secondary bg-secondary-container/10",
              )}
            >
              <Icon
                name="cloud_upload"
                className="mb-4 text-4xl text-on-surface-variant group-hover:text-secondary"
              />
              <p className="text-center text-body-md text-on-surface">
                Déposez vos captures d&apos;écran ou cliquez pour parcourir
              </p>
              <p className="mt-2 text-xs text-on-surface-variant">
                PNG, JPG ou GIF jusqu&apos;à 10MB par fichier
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) {
                    handleFiles(event.target.files);
                    event.target.value = "";
                  }
                }}
              />
            </button>

            {previews.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {previews.map((preview) => (
                  <div
                    key={preview.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-outline-variant"
                  >
                    <img src={preview.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(preview.id)}
                      className="absolute top-1 right-1 rounded-full bg-error p-1 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                      aria-label="Supprimer l'image"
                    >
                      <Icon name="delete" className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-4 text-headline-md text-on-surface">Stack Technique</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="tech-select" className={PROJECT_FORM_LABEL_CLASS}>
                  Technologies Utilisées
                </label>
                {technologies.length > 0 ? (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="transition-colors hover:text-error"
                          aria-label={`Retirer ${tech}`}
                        >
                          <Icon name="close" className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <select
                  id="tech-select"
                  defaultValue=""
                  onChange={(event) => {
                    addTechnology(event.target.value);
                    event.target.value = "";
                  }}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md outline-none"
                >
                  <option value="" disabled>
                    Ajouter une tech...
                  </option>
                  {PROJECT_TECH_OPTIONS.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-4 text-headline-md text-on-surface">Liens Externes</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="github" className={PROJECT_FORM_LABEL_CLASS}>
                  GitHub Repository
                </label>
                <div className="relative">
                  <Icon
                    name="code"
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    id="github"
                    name="github"
                    type="url"
                    placeholder="https://github.com/user/repo"
                    className={cn(PROJECT_FORM_FIELD_CLASS, "py-2 pl-10")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="demo" className={PROJECT_FORM_LABEL_CLASS}>
                  Lien Démo (Live)
                </label>
                <div className="relative">
                  <Icon
                    name="rocket_launch"
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    id="demo"
                    name="demo"
                    type="url"
                    placeholder="https://mon-projet.vercel.app"
                    className={cn(PROJECT_FORM_FIELD_CLASS, "py-2 pl-10")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary-container p-6 text-on-primary-container group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-500 group-hover:scale-110">
              <Icon name="tips_and_updates" className="text-9xl" />
            </div>
            <h3 className="mb-2 text-headline-md">Conseil Portfolio</h3>
            <p className="text-sm opacity-90">
              Les projets avec des descriptions de plus de 300 mots et au moins 3 captures
              d&apos;écran reçoivent 4x plus de vues.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={submitState !== "idle"}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95",
                submitState === "success"
                  ? "bg-secondary text-white"
                  : "bg-primary text-on-primary hover:shadow-xl",
                submitState === "loading" && "opacity-90",
              )}
            >
              {submitState === "loading" ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" />
                  Envoi...
                </>
              ) : submitState === "success" ? (
                <>
                  <Icon name="check_circle" />
                  Publié avec succès !
                </>
              ) : (
                <>
                  <Icon name="send" />
                  Publier le projet
                </>
              )}
            </button>
            <button
              type="button"
              disabled={submitState !== "idle"}
              onClick={() => submitProject(true)}
              className="w-full rounded-xl border-2 border-primary py-4 font-bold text-primary transition-all hover:bg-surface-container-low disabled:opacity-50"
            >
              Enregistrer comme brouillon
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
