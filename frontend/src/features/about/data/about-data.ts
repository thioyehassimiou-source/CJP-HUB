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

export const ABOUT_STATS = [
  { value: "8+", label: "Années d'impact" },
  { value: "500+", label: "Membres formés" },
] as const;

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

export const ABOUT_LEADERS = [
  {
    name: "Diallo Mamadou",
    role: "Président",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMp_K3kdKAwaXHd0A9KP-nIHeen2tv5Kq4Ei2q5dRB11TdCsxu3XXMLjK4nlO2xmCvnoWPjxp7PsPvbSt_tPsWWINRVKcjnW-xgn2wI0QhzOYx7yqYNvhg0Qhq4nsQyxdDWY1HXur-In5E5vH6OXs4szIGSS7jvkwT_OiDttTZlYBCCr5E_jL6T2lgwcuoEnEzmqIFrr-N1l4TdTJQX8tahpsu6OiMMewSpTryoMlIVjny5ScsSZqLB6GkYp9Nskm5-V856AmOafg",
  },
  {
    name: "Barry Fatoumata",
    role: "Responsable Technique",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCd2XLpVxl_6c2zHj8mlSiHvy96yN-u9SXIkXxfKudQnLeiiL8pExfYXPc3Co--TOqnsihZmWvbBJoz9eg3AqexW3EB9qX0wbnQeIau4gqj4Dr5YPFduidOhDa6NixTY9CXS6aqJ7ZGJBC7RHoxAJHD-EU-T-UgiTp7EPfm7zkcGdsvo3q7c2VZjFwEOZb8iyf1k39WuTwd-sPAPZL5vv326sYAOqdx99Y8VErfj6euxyQJpGbOveX7i4OzZIwkl_h6HfNLyVIABAg",
  },
  {
    name: "Camara Ibrahima",
    role: "Secrétaire Général",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzHEfTO-hMjQVFMUbn-jiLTl7K_OrGyKg-NlxdFrNFVDboRFlDA86dBI2N6Y4zIVXaEMEyXyGEyYuHJICeZHPw4v_sPS9SupL5sPiRbAiTo0Rqt9jS-xLYUHQnFBlbGmghkr4JEPJDm8JsxHl-vJ54avotyz5744JsbV2WANBSamI1opSsIvtdmVhBzE9lQI0TDzMl1eC2B2sFHP1TCvKXQOSxInNZgBi0dtdaPO-oNSdZq_oX_rNg39bc63E9iDdxpooJ8WqgJfU",
  },
  {
    name: "Sow Mariama",
    role: "Chargée de Projets",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIw2GdzeDZElB9HRSdu7Wa7T7fM3VVrDfKfuEIA44SMjcHqiO6SFL5cdW2jajPSU_QEj39HG-jAo7TD1DwZrAwTkWJFRZ8ITqmTy4HEcNa7qDYF0lAW_vmlOOVElTHw8vxFh7qzryh1arUOldeBwAfeTCtZGCa0p1pWPrQTpOoMLfaZgexiMyFfd3Wblidl1XFO8OKipgqvuo6KDSeGZKkzCbwFlpi0KZs4PKmGF32uEjIEDQYEFSlPgIBstXAqMte24yfHfHR8uU",
  },
] as const;

export const ABOUT_PARTNERS = [
  { icon: "school", name: "Université de Labé" },
  { icon: "hub", name: "Labé Tech Hub" },
  { icon: "cloud", name: "Ministère de l'Innovation" },
] as const;
