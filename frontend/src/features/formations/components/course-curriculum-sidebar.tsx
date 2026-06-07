import type { CoursePlayerData, CurriculumLesson } from "@/features/formations/data/course-player-data";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

function lessonIcon(status: CurriculumLesson["status"]) {
  switch (status) {
    case "completed":
      return { name: "check_circle", filled: true, className: "text-secondary" };
    case "active":
      return { name: "play_circle", filled: true, className: "" };
    case "locked":
      return { name: "lock", filled: false, className: "text-outline" };
    default:
      return { name: "radio_button_unchecked", filled: false, className: "text-outline" };
  }
}

function LessonRow({ lesson }: { lesson: CurriculumLesson }) {
  const icon = lessonIcon(lesson.status);
  const isActive = lesson.status === "active";
  const isCompleted = lesson.status === "completed";
  const isLocked = lesson.status === "locked";

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border p-sm transition-colors",
        isActive && "border-primary-container bg-primary-container text-white shadow-md",
        isCompleted && "border-secondary/20 bg-secondary/5 text-secondary",
        !isActive && !isCompleted && !isLocked && "cursor-pointer border-transparent hover:bg-surface-container-low",
        isLocked && "cursor-not-allowed border-transparent opacity-50",
      )}
    >
      <Icon
        name={icon.name}
        filled={icon.filled}
        className={cn("mr-sm text-sm", icon.className, isActive && "text-white")}
      />
      <span
        className={cn(
          "truncate text-label-md",
          isActive && "font-bold",
          isLocked && "text-on-surface-variant",
          !isActive && !isCompleted && "font-medium text-on-surface-variant",
        )}
      >
        {lesson.title}
      </span>
      <span className={cn("ml-auto text-[10px]", isActive ? "opacity-60" : "text-outline")}>
        {lesson.duration}
      </span>
    </div>
  );
}

export function CourseCurriculumSidebar({ course }: { course: CoursePlayerData }) {
  return (
    <aside className="flex w-full flex-col border-t border-outline-variant bg-white shadow-lg lg:w-80 lg:border-t-0 lg:border-l">
      <div className="border-b border-outline-variant p-md">
        <h3 className="mb-sm text-headline-md font-bold text-primary">Progression</h3>
        <div className="space-y-xs">
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>
              {course.completedChapters} / {course.totalChapters} Chapitres complétés
            </span>
            <span>{course.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-secondary shadow-inner"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="custom-scrollbar max-h-[420px] flex-1 overflow-y-auto lg:max-h-none">
        <div className="space-y-md p-md">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="space-y-sm">
              <h4 className="text-label-md uppercase tracking-wider text-outline">{chapter.title}</h4>
              <div className="space-y-1">
                {chapter.lessons.map((lesson) => (
                  <LessonRow key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant bg-surface-container-low p-md">
        <div className="rounded-xl border border-outline-variant bg-white p-md text-center shadow-sm">
          <Icon name="assignment" className="mb-xs text-3xl text-secondary" />
          <h5 className="mb-xs text-label-md font-bold text-primary">Module Prêt pour Evaluation</h5>
          <p className="mb-md text-[11px] leading-tight text-on-surface-variant">
            Validez vos compétences sur ce chapitre pour débloquer la suite.
          </p>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-secondary py-sm text-label-md text-white transition-all hover:opacity-90 active:scale-95"
          >
            Passer le Quiz
            <Icon name="arrow_forward" className="ml-sm text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}
