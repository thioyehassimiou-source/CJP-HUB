export type CurriculumLesson = {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "active" | "locked" | "available";
};

export type CurriculumChapter = {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
};

export type CourseResource = {
  id: string;
  title: string;
  meta: string;
  icon: string;
  action: "download" | "external";
};

export type CoursePlayerData = {
  id: string;
  track: string;
  title: string;
  chapterTitle: string;
  description: string;
  difficulty: string;
  duration: string;
  videoPoster: string;
  videoDuration: string;
  videoProgress: string;
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  resources: CourseResource[];
  chapters: CurriculumChapter[];
};

const VIDEO_POSTER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUKDbMSuLcRhbmuK3aeZoSAyx7DHDYQ2TsEZobOtJ8wh1T7x_RBX_66BtmRs0zSemKjIc1lMVrfKxO-h1fv0amGcctIkkncr2Xik5argmfc675O7q7gl7HtPxgaVDVVBrUzBrjf-x3pOzg-3I1mXUhGF_DBQnlfmWwuxgRYwLxLzerlOEpmX1NVWTz5ehYa9Ue8uawrGSTa4c1gmC0QhVyH0cmFY_LhPHNbfpIgTw7GjzqVCIeXQfetcqwa7eb_2umUUVhploDJZ4";

const INSTRUCTOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMaIBMkrRtdhV8WPzgC5irRArGjXTLfEm7A-636qbk-NLBBTDYFOKJOMwb_sSELaM_oc-ZcXsc6DOe8W5Q9pA_ZdFJp0tEAlAyoFEC7_ww9mTrqJqDLQgmk09QNTXiP0kyzXJSLsOmi9X-uEn3I9mrBqldfeaXEQtN1tjII0gsYkeMGr2Ftft5Af5LG8kH7VeFM9t1XX2AFTdqn7xgJtPRKqJtN1pkSE2qbjRUkKMVy8wa9SkH9oKbUYemxk5yzf7NMUZODaZEL-c";

export const ACADEMY_TOP_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvMxg23ONz0FR5NLK5VNqGGKUhQ-dGKOFHDtja9Y7HUn-8kacCepvpFewu7OfzAbrGJ3nwhjnRcBs0L4dzBGEpsIlSk45zp6DlDDGorFnLtfeQvFD74RJw1Y0aAcTDGC0PLkA9L0SBwWgZj-cQN558YANfzd1bGQRjXXJZX8fLIS0khJx81PUZKLT7JyvEHH1YtGlSA1s3vXz4_LOawfKtKbAz-FzDE7_FQuxy56ahkdTLni9mELtFTG9xnmegbk5cB3ohwriJ2Ck";

export const ACADEMY_SIDEBAR_NAV = [
  { href: "/dashboard/formations", label: "Academy", icon: "school", matchPrefix: "/dashboard/formations" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", matchPrefix: "/dashboard" },
  { href: "/dashboard/evenements", label: "Événements", icon: "calendar_today", matchPrefix: "/dashboard/evenements" },
  { href: "/dashboard/tresorerie", label: "Finance", icon: "payments", matchPrefix: "/dashboard/tresorerie" },
  { href: "/dashboard/projets", label: "Portfolio", icon: "account_circle", matchPrefix: "/dashboard/projets" },
  { href: "/dashboard/bibliotheque", label: "Bibliothèque", icon: "menu_book", matchPrefix: "/dashboard/bibliotheque" },
] as const;

export const MICROSERVICES_COURSE: CoursePlayerData = {
  id: "microservices-k8s",
  track: "Ingénierie Logicielle",
  title: "Architecture Microservices Avancée",
  chapterTitle: "Chapitre 4 : Orchestration avec Kubernetes",
  description:
    "Dans ce module, nous explorons les concepts fondamentaux de l'orchestration de conteneurs. Vous apprendrez à configurer des clusters haute disponibilité, à gérer les déploiements rolling updates et à assurer la résilience de vos services critiques au sein du hub technologique du club.",
  difficulty: "Intermédiaire",
  duration: "38 min",
  videoPoster: VIDEO_POSTER,
  videoDuration: "12:45 / 38:20",
  videoProgress: "33",
  progressPercent: 35,
  completedChapters: 4,
  totalChapters: 12,
  instructor: {
    name: "Dr. Jean-Pierre Dupont",
    role: "Expert Cloud Computing & Architecte Senior",
    avatar: INSTRUCTOR_AVATAR,
  },
  resources: [
    {
      id: "k8s-pdf",
      title: "Aide-mémoire K8s.pdf",
      meta: "PDF • 2.4 MB",
      icon: "description",
      action: "download",
    },
    {
      id: "deploy-sh",
      title: "Scripts de déploiement.sh",
      meta: "Shell • 15 KB",
      icon: "terminal",
      action: "download",
    },
    {
      id: "docs",
      title: "Documentation Officielle",
      meta: "LIEN EXTERNE",
      icon: "link",
      action: "external",
    },
  ],
  chapters: [
    {
      id: "intro",
      title: "Introduction",
      lessons: [
        { id: "l1", title: "1. Bienvenue à l'Academy", duration: "05:20", status: "completed" },
        { id: "l2", title: "2. Pourquoi les Microservices ?", duration: "12:45", status: "completed" },
      ],
    },
    {
      id: "fundamentals",
      title: "Fondamentaux",
      lessons: [
        { id: "l3", title: "3. Docker & Containerisation", duration: "25:10", status: "completed" },
        { id: "l4", title: "4. Orchestration avec Kubernetes", duration: "38:20", status: "active" },
        { id: "l5", title: "5. Configuration & Secrets", duration: "18:15", status: "locked" },
        { id: "l6", title: "6. Service Mesh (Istio)", duration: "42:00", status: "locked" },
      ],
    },
    {
      id: "advanced",
      title: "Avancé",
      lessons: [
        { id: "l7", title: "7. Observabilité & Logging", duration: "30:00", status: "locked" },
      ],
    },
  ],
};

export const COURSE_PLAYER_MAP: Record<string, CoursePlayerData> = {
  "microservices-k8s": MICROSERVICES_COURSE,
};

export function getCoursePlayerData(courseId: string): CoursePlayerData | undefined {
  return COURSE_PLAYER_MAP[courseId];
}
