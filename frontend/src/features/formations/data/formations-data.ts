export type FormationCategory =
  | "all"
  | "web"
  | "mobile"
  | "ai"
  | "backend"
  | "security"
  | "data";

export type FormationStatus = "completed" | "in_progress" | "not_started";

export type FormationCourse = {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  category: FormationCategory;
  badge: string;
  badgeClass: string;
  image: string;
  status: FormationStatus;
  progress?: number;
};

export const FORMATION_CATEGORIES: Array<{
  id: FormationCategory;
  label: string;
  icon: string;
}> = [
  { id: "all", label: "Toutes les formations", icon: "category" },
  { id: "web", label: "Web Dev", icon: "language" },
  { id: "mobile", label: "Mobile", icon: "smartphone" },
  { id: "ai", label: "IA & ML", icon: "psychology" },
  { id: "backend", label: "Backend", icon: "terminal" },
];

export const ACTIVE_COURSES = [
  {
    id: "microservices-k8s",
    title: "Architecture Microservices Avancée",
    progress: 35,
  },
  {
    id: "react-patterns",
    title: "Advanced React Patterns",
    progress: 75,
  },
];

export const FORMATION_COURSES: FormationCourse[] = [
  {
    id: "microservices-k8s",
    title: "Architecture Microservices Avancée",
    duration: "48h",
    difficulty: "Intermédiaire",
    category: "backend",
    badge: "BACKEND",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUKDbMSuLcRhbmuK3aeZoSAyx7DHDYQ2TsEZobOtJ8wh1T7x_RBX_66BtmRs0zSemKjIc1lMVrfKxO-h1fv0amGcctIkkncr2Xik5argmfc675O7q7gl7HtPxgaVDVVBrUzBrjf-x3pOzg-3I1mXUhGF_DBQnlfmWwuxgRYwLxLzerlOEpmX1NVWTz5ehYa9Ue8uawrGSTa4c1gmC0QhVyH0cmFY_LhPHNbfpIgTw7GjzqVCIeXQfetcqwa7eb_2umUUVhploDJZ4",
    status: "in_progress",
    progress: 35,
  },
  {
    id: "react-next",
    title: "Mastering React 18 & Next.js",
    duration: "24h",
    difficulty: "Avancé",
    category: "web",
    badge: "WEB",
    badgeClass: "bg-secondary-container text-on-secondary-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD79K90zCQKai87r98pCgqyzFGqXzaE3EUCLCtC1qXoSfbEhQDp8RDrVGO_nMjLWbg-LbuowoslfchJ-y3cOU_PxqnbgitwmaeDPWoHYw2_ImVwegXSPjPBgEjzZUrQHH047s9vWTBzfhV09MAEi0BoDIIc8dJKEOGhXcpvL-geYmW6-RjZw9GgdzJjXswml4guyhImF8h2KY_xx7W6s0AkhkvgpfsHLufQ6FC2Hg0g2FDG3TLTXfxDWDuAe6EMzjrNbQIjCmn3Jcg",
    status: "completed",
    progress: 100,
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Fundamentals",
    duration: "18h",
    difficulty: "Intermédiaire",
    category: "security",
    badge: "SECURITY",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnCQKHdM6ruqb_xwSLa409hBjO-3sJyFLraK6oT7syl_PnCahy4y07e6MOJhFjv7VqddrSwuKwUIVdh8vk2dIqokUwVJoh_g_hR_fMwqwRAxtHY-EcbiJoukoBkHK5q9HPCHBYcGw6u5pkgTFCF1QPUQ3IfHnUssoOC1i3TyiwafNq_xGWuk_GpTuJsEDWR0DjP4sSIrUif0iVTWQrcI4ccPZWqZOkjqKd1ty0y3Okmh58zUwUBW0pT0OP48GM0tvpPYZnpQPz3A",
    status: "in_progress",
    progress: 45,
  },
  {
    id: "python-data",
    title: "Python for Data Analysis",
    duration: "32h",
    difficulty: "Débutant",
    category: "data",
    badge: "DATA SCIENCE",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuJ2vPH2gFCTwKzO03sL6EouPT-FkAxULeACqOCl28947eULQpmqI6bcLbcXqCste8Gsm_Ys99q8EZfBIP2WxzbKjz_pKDa6EtVx9arHiJd658SFHUr97Z4bp3RwG5jlArAH9rzCukmTOXDYKG0S3brzDpnwxJwOKmXsxmYLmdCFaH7EjR27E7Uz-cusmyNPx6ETz774eRPAs_2pfxxRNiTC11qkAr26jA4myNXH2PyhnUjOGPoqtrRuDzNPgp_3zUd0j_NU8Inq0",
    status: "not_started",
  },
  {
    id: "ai-ethics",
    title: "AI Ethics and Implementation",
    duration: "12h",
    difficulty: "Expert",
    category: "ai",
    badge: "AI",
    badgeClass: "bg-secondary-container text-on-secondary-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmz5TMnjhQxLQGQDalRNGEhHFrnM6LRmcPEjee9EPW0CdE05xyHhLRcmlyTdl32Ud5tSeJxuNppfaOvBZTFNaxZPcWcLwsasredlpUizHssw4O59Tg7-QJEStQ5YzUzib4OmBZ0ydqqGhrjNQyCmTIx6TE8XkEXL7VoyWFN0kwlmwRgCqQUY4HAOkcnvK_wqE0U3RdxE7MZ5rlBnVvglGHN-WhPrTkHWJhQ2dKF4ag3lK8NiyAU-0Jk3IsAqb0fRxROKGs52WTq-c",
    status: "not_started",
  },
  {
    id: "flutter",
    title: "Flutter Enterprise Mastery",
    duration: "40h",
    difficulty: "Avancé",
    category: "mobile",
    badge: "MOBILE",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCph-p8BMDrM444zpl3sWdbZTXuTs9_ZQ9UWTclrPcl-r-o7fuG1PAheiTch7odcxUzvDYZa0MlaeOGeBERYSc_Jv0wqPkSlOX0FPkrKJzl4ys0C3C0cLzynlZ-dEDjJnzY_ueJ6i0W8yy6loqB0LvW6egq6n07_4ZBCaNWQWn_6Mc6ZrRkCzc2m_JeGOvUR1GCh7oEWJ909FbVKEJaXaOENnnAlecs_4YaYv3Npty8NkN3c5Lk8Ohdvi8TTg4OE6DRorRz6sV1y_Q",
    status: "not_started",
  },
  {
    id: "nodejs",
    title: "Scalable Node.js Systems",
    duration: "28h",
    difficulty: "Intermédiaire",
    category: "backend",
    badge: "BACKEND",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPu24oEv91hjkKeV5X4iV-cqmFl_esK9sXIeQFNq-vjfw_yhuw-yW8Soh19_AjW-Bi6s-YSkmo-8sl7NL9eSzkrm1eAomCjnFmNxdWIjzZcLCG2IXBhYKiFujYYsNPOq7c_H11QJCPkWpbm6TK-wM-yhf064Yu3ALoPx-rSqNDR4xrcDMD_1B80yrZJ9XPVm1Mm1Q1TeHeIkH5md082bZniXccFDzm1AL25leRFKDHJCMgUmMQ4K8BrVGiSjb1no3wEsnikI4Ojhk",
    status: "not_started",
  },
];

export const SORT_OPTIONS = [
  { id: "popularity", label: "Popularité" },
  { id: "newest", label: "Plus récentes" },
  { id: "difficulty", label: "Difficulté" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["id"];
