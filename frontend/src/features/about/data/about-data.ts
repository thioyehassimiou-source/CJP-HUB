import { CJP_EVENT_IMAGES } from "@/lib/auth-data";

export const ABOUT_NAV = [
  { href: "/", label: "Accueil", active: false },
  { href: "/a-propos", label: "À propos", active: true },
  { href: "/dashboard/projets", label: "Projets", active: false },
  { href: "/dashboard/admin", label: "Membres", active: false },
  { href: "/dashboard/evenements", label: "Événements", active: false },
] as const;

export const ABOUT_FOOTER_LINKS = [
  { href: "#", label: "Politique de confidentialité" },
  { href: "#", label: "Code de conduite" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Ressources" },
] as const;

export const ABOUT_SOCIAL_LINKS = [
  { href: "#", icon: "alternate_email" as const },
  { href: "#", icon: "terminal" as const },
] as const;

export const ABOUT_HERO_IMAGE = CJP_EVENT_IMAGES.digitalis;

export const ABOUT_STORY_IMAGE = CJP_EVENT_IMAGES.forumWeb;

export const ABOUT_VALUES = [
  {
    icon: "lightbulb",
    title: "Innovation",
    description:
      "Nous explorons sans cesse de nouvelles technologies pour rester à l'avant-garde du numérique guinéen.",
  },
  {
    icon: "groups",
    title: "Collaboration",
    description:
      "L'apprentissage par les pairs est notre fondation. Ensemble, nous construisons des solutions robustes.",
  },
  {
    icon: "public",
    title: "Engagement",
    description:
      "Notre technologie sert la communauté. Nous résolvons des problèmes locaux avec un impact global.",
  },
] as const;

export const ABOUT_PARTNERS = [
  { icon: "school", name: "Université de Labé" },
  { icon: "hub", name: "Labé Tech Hub" },
  { icon: "cloud", name: "Ministère de l'Innovation" },
] as const;
