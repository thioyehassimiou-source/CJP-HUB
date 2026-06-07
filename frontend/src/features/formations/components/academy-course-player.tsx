import { useState } from "react";
import { Link } from "react-router-dom";
import type { CoursePlayerData } from "@/features/formations/data/course-player-data";
import { AcademyCourseTopNav } from "@/features/formations/components/academy-course-top-nav";
import { CourseCurriculumSidebar } from "@/features/formations/components/course-curriculum-sidebar";
import { Icon } from "@/components/ui/icon";

function CourseVideoPlayer({ course }: { course: CoursePlayerData }) {
  const [progress, setProgress] = useState(Number(course.videoProgress));

  return (
    <div className="group relative aspect-video overflow-hidden rounded-xl border border-outline-variant bg-black shadow-2xl">
      <img
        src={course.videoPoster}
        alt=""
        className="h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/90 text-white shadow-xl transition-transform hover:scale-110"
          aria-label="Lire la vidéo"
        >
          <Icon name="play_arrow" filled className="text-4xl" />
        </button>
      </div>
      <div className="absolute right-0 bottom-0 left-0 flex items-center space-x-md bg-gradient-to-t from-black/80 to-transparent p-lg">
        <Icon name="pause" className="cursor-pointer text-white" />
        <button
          type="button"
          className="relative h-1 flex-1 rounded-full bg-white/30"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const pos = ((event.clientX - rect.left) / rect.width) * 100;
            setProgress(Math.max(0, Math.min(100, pos)));
          }}
          aria-label="Progression de la vidéo"
        >
          <span
            className="absolute top-0 left-0 h-full rounded-full bg-secondary"
            style={{ width: `${progress}%` }}
          />
          <span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md"
            style={{ left: `${progress}%` }}
          />
        </button>
        <span className="font-code-sm text-code-sm text-white">{course.videoDuration}</span>
        <Icon name="volume_up" className="cursor-pointer text-white" />
        <Icon name="fullscreen" className="cursor-pointer text-white" />
      </div>
    </div>
  );
}

type AcademyCoursePlayerProps = {
  course: CoursePlayerData;
};

export function AcademyCoursePlayer({ course }: AcademyCoursePlayerProps) {
  return (
    <main className="flex min-h-[calc(100vh-var(--cjp-nav-height))] flex-col">
      <AcademyCourseTopNav />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          <div className="custom-scrollbar flex-1 space-y-lg overflow-y-auto p-lg">
            <nav className="flex items-center space-x-sm text-label-md text-on-surface-variant">
              <Link to="/dashboard/formations" className="transition-colors hover:text-primary">
                Academy
              </Link>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="transition-colors hover:text-primary">{course.track}</span>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="font-bold text-primary">{course.title}</span>
            </nav>

            <CourseVideoPlayer course={course} />

            <div className="grid grid-cols-1 gap-lg xl:grid-cols-3">
              <div className="space-y-md xl:col-span-2">
                <div className="flex flex-col justify-between gap-md sm:flex-row sm:items-center">
                  <h2 className="text-headline-lg font-bold text-primary">{course.chapterTitle}</h2>
                  <div className="flex items-center space-x-sm">
                    <span className="rounded border border-secondary/20 bg-secondary/10 px-sm py-1 text-label-md text-secondary">
                      {course.difficulty}
                    </span>
                    <span className="rounded border border-outline-variant bg-surface-container-high px-sm py-1 text-label-md text-on-surface-variant">
                      {course.duration}
                    </span>
                  </div>
                </div>

                <p className="text-body-lg leading-relaxed text-on-surface-variant">{course.description}</p>

                <div className="flex items-center rounded-xl border border-outline-variant bg-white p-md shadow-sm">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="mr-md h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-label-md text-primary">{course.instructor.name}</h4>
                    <p className="text-xs text-on-surface-variant">{course.instructor.role}</p>
                  </div>
                  <button
                    type="button"
                    className="ml-auto rounded-lg border border-secondary px-md py-sm text-label-md text-secondary transition-colors hover:bg-secondary/5"
                  >
                    Profil de l&apos;instructeur
                  </button>
                </div>
              </div>

              <div className="h-fit rounded-xl border border-outline-variant bg-white p-md shadow-sm">
                <h3 className="mb-md flex items-center text-headline-md font-bold">
                  <Icon name="folder_zip" className="mr-sm text-secondary" />
                  Ressources
                </h3>
                <div className="space-y-sm">
                  {course.resources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      className="group flex w-full items-center rounded-lg border border-transparent p-sm text-left transition-colors hover:border-outline-variant hover:bg-surface-container-low"
                    >
                      <Icon name={resource.icon} className="mr-sm text-on-surface-variant" />
                      <div className="flex-1">
                        <p className="text-label-md text-primary">{resource.title}</p>
                        <p className="text-[10px] uppercase text-on-surface-variant">{resource.meta}</p>
                      </div>
                      <Icon
                        name={resource.action === "external" ? "open_in_new" : "download"}
                        className="text-outline opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <CourseCurriculumSidebar course={course} />
        </div>
    </main>
  );
}
