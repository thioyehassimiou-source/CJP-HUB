export const CJP_EVENT_IMAGES = {
  digitalis: "/brand/events/cjp-digitalis.jpg",
  forumWeb: "/brand/events/cjp-forum-web.jpg",
  forumAudience: "/brand/events/cjp-forum-audience.jpg",
} as const;

export type AuthHeroSlide = {
  image: string;
  eyebrow?: string;
  title: string;
  description: string;
};

export const AUTH_CONNEXION_SLIDES: AuthHeroSlide[] = [
  {
    image: CJP_EVENT_IMAGES.digitalis,
    eyebrow: "Université de Labé",
    title: "La communauté CJP",
    description:
      "Rejoignez des centaines de jeunes programmeurs lors de conférences, ateliers et rencontres tech sur le campus.",
  },
  {
    image: CJP_EVENT_IMAGES.forumWeb,
    eyebrow: "Forum tech",
    title: "Développement web & réseaux",
    description:
      "IA, cybersécurité, mobile — des événements d'envergure pour progresser aux côtés de pairs motivés.",
  },
  {
    image: CJP_EVENT_IMAGES.forumAudience,
    eyebrow: "Événements CJP",
    title: "Formations certifiantes",
    description:
      "Web, mobile, IA et cybersécurité — développez des compétences recherchées par le marché.",
  },
];

export const AUTH_INSCRIPTION_SLIDES: AuthHeroSlide[] = [
  {
    image: CJP_EVENT_IMAGES.forumAudience,
    eyebrow: "Rejoindre le club",
    title: "Construisez votre avenir",
    description:
      "Transformez votre passion pour le code en expertise certifiée reconnue à l'Université de Labé.",
  },
  {
    image: CJP_EVENT_IMAGES.digitalis,
    eyebrow: "DIGITALIS",
    title: "Une communauté soudée",
    description:
      "Collaborez, partagez et progressez aux côtés des meilleurs talents informatiques du campus.",
  },
  {
    image: CJP_EVENT_IMAGES.forumWeb,
    eyebrow: "Parcours CJP",
    title: "Parcours sur mesure",
    description:
      "Choisissez votre filière et accédez à un catalogue complet de ressources pédagogiques.",
  },
];

export const GOOGLE_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAOntPrVkY-0JbN-XzEqs0IbJn9fXjaPveEiHmzrD59C8cY73v3oqzqgHbQ6Zcr0lt3NW3EnvgByDv8bNekHViUEgh4FxqPEde0-Oj5H1XeKRQc6L0fk7I87Ux6ICYCF2hG5nJznDNesBiA9D5jo4ko-wDrar9Ed-49yJTM6E8CsON5D-6eMYL-0_8A1fhZGcMfwT77vP5iGJJnLddzS9hBwTSNdxnRwkcMHdctod1o5ifiEk-rH9Fhe8gS5sF5IQtGgG9u_QfWWyw";

export const authFieldClass =
  "w-full rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_35%,#ccc)] bg-white px-4 py-3 text-sm text-[var(--cjp-black)] outline-none transition-all placeholder:text-[var(--cjp-text-muted)] focus:border-[var(--cjp-gold)] focus:ring-2 focus:ring-[var(--cjp-gold)]/20";

export const authLabelClass = "mb-1.5 block text-sm font-medium text-[var(--cjp-black)]";

export const authLinkClass =
  "text-sm font-semibold text-[var(--cjp-gold-dark)] transition-colors hover:text-[var(--cjp-gold)]";

export const authSubmitClass =
  "btn-cjp flex w-full items-center justify-center !py-3.5 disabled:cursor-not-allowed disabled:opacity-70";

export const authSocialClass =
  "flex h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--cjp-border)_35%,#ccc)] bg-white text-sm text-[var(--cjp-black)] transition-colors hover:border-[var(--cjp-gold)] hover:text-[var(--cjp-gold-dark)] active:scale-[0.98]";
