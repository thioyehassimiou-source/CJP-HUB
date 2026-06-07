export const POSTER_BACKGROUND =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYx14TrgzYI2Jlxox7exFxWcU96cJVLVoRAekN3EzgGAWB0--hKvvWTgKfnlytU7JJEXlo-jpLvjxzdbNrB8ibezn5sXf8glT-VcPu0uZ9dwZxgcbQqHGAS8Lno2TZYKa6eYNn-qgan13qwwGEdFdZjtLFc2nyFGkBoPeI2K-xLkkvj9yGS61OsQ8iTU4YN36BU75FmH5MOPxHe3x0vx8HyKidONh_Elgl6kcc1cWuZlFu9u1-Lx1sV8voBmAu346Ch7ir7QJpETc";

export const POSTER_ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-AjnNBVONDX_qoob4qi7AAt3d-kwphskUKXLzkCf80yTmH6jij96rlCTQb5MreiFSsB6-JiOqF3XYg0-W-S76JA6UlCDaFwgQKq-xBxLatcXnHk0ytXJTvkUidqhk9Y0BRBe-XftxTnNj-jUR29DdEx2jjq9aIiuH8U-ShrjHAa-sl9vEnQ2n9JK37HQcnPlaHNT1E8rA4WGnEL536lKrH2MA5Ks5k-n2i1JwGgnKGMBcGrAHpW8-VD1EAl7YA83bYAVEQOXqSsg";

export const DOC_GEN_TABS = [
  { id: "documents", label: "Documents" },
  { id: "attestations", label: "Attestations" },
  { id: "affiches", label: "Affiches" },
] as const;

export type DocGenTabId = (typeof DOC_GEN_TABS)[number]["id"];

export type PosterEventId =
  | "hackathon-2024"
  | "workshop-ai"
  | "conf-cyber"
  | "dev-night";

export type PosterEvent = {
  id: PosterEventId;
  label: string;
  title: string;
  date: string;
  venue: string;
  speaker: string;
  tagline: string;
};

export const POSTER_EVENTS: PosterEvent[] = [
  {
    id: "hackathon-2024",
    label: "Hackathon CJP 2024",
    title: "HACKATHON CJP 2024",
    date: "15 - 17 NOVEMBRE",
    venue: "TECH CENTER 402",
    speaker: "DR. ELISABETH VANCE",
    tagline: "BUILDING THE FUTURE",
  },
  {
    id: "workshop-ai",
    label: "Workshop Intelligence Artificielle",
    title: "WORKSHOP IA & ML",
    date: "22 DÉCEMBRE",
    venue: "AMPHI G2",
    speaker: "MARCUS AURELIUS",
    tagline: "DEEP LEARNING SERIES",
  },
  {
    id: "conf-cyber",
    label: "Conférence Cybersécurité",
    title: "CYBER SECURITY SUMMIT",
    date: "10 JANVIER",
    venue: "MAIN HALL",
    speaker: "SARAH CONNOR",
    tagline: "DEFEND THE NETWORK",
  },
  {
    id: "dev-night",
    label: "Dev Night Marathon",
    title: "DEV NIGHT MARATHON",
    date: "05 FÉVRIER",
    venue: "LABO 24/7",
    speaker: "ALEX RIVERA",
    tagline: "CODE UNTIL DAWN",
  },
];

export type PosterTemplate = "modern" | "classic" | "hackathon";

export const POSTER_TEMPLATES: { id: PosterTemplate; label: string }[] = [
  { id: "modern", label: "Moderne" },
  { id: "classic", label: "Classique" },
  { id: "hackathon", label: "Hackathon" },
];

export const ACCENT_COLORS = [
  { id: "green", value: "#006c49" },
  { id: "navy", value: "#131b2e" },
  { id: "red", value: "#ba1a1a" },
] as const;
