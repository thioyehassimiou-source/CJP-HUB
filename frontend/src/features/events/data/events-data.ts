export type EventType = "workshop" | "hackathon" | "networking" | "lecture";

export type EventAttendee = {
  id: string;
  name: string;
  level: string;
  avatar: string;
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string;
  month: string;
  day: number;
  dateHighlight?: "primary" | "neutral";
  time: string;
  location: string;
  type: EventType;
  typeLabel: string;
  typeClass: string;
  capacity: number;
  registered: number;
  status: string;
  statusClass: string;
  poster: string;
  registrationAvatars: string[];
  extraRegistrations?: number;
  extraRegistrationClass?: string;
  attendees: EventAttendee[];
};

export const UPCOMING_EVENTS: ClubEvent[] = [
  {
    id: "react-patterns",
    title: "Advanced React Patterns & SSR",
    description:
      "Plongée dans les hooks, les Server Components et les stratégies d'optimisation des performances pour les applications web modernes.",
    month: "OCT",
    day: 24,
    dateHighlight: "primary",
    time: "14:00 - 17:00",
    location: "Labo Tech principal, Salle 402",
    type: "workshop",
    typeLabel: "Atelier",
    typeClass: "bg-secondary-container text-on-secondary-container",
    capacity: 50,
    registered: 34,
    status: "Ouvert",
    statusClass: "text-on-secondary-container",
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSmYhh6DlScoxntVH2k4Y9icGQyOegzlbHfLa7PrIS2w4oW_bSKMOwHNsvlNEv8MNuIjoIg48vPiKOqEBF56-IU3WWZtmK3upGjFThnDj7HR2yWqq7FzncpFRkqqxEpu6alrs4wYHWQGHmUK-iMPDvb-YGPSmw17OtXhVeJxJeoYpGojqaEflUzJZE_y2vJdwmZ4ybzBxvLbYLzThCkJvGo0awiv0nPEWbIkXQHPHKuvzneOmNz67_mjNbpz2CZTXh8FznaWizdEc",
    registrationAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUKKUlQ3dlpNvJkH4SHKLhTBAnIcQA2Mu5u2Wspi5E_tzRzD0b3o-TvQfNVUtVgST5IosK7l-pcQXs4N473INduvImkgb4JoaTjnLK69UIKHvwozo0E8-2sye5B51JmPBGbrgvPiEl-MGNfFXH05-Mv91EZD0IO2BUpq7m986Pt6gZZ7dpprknOpZBOfwz7W-0XrV71idvJLZjpJ9OQWjeJfZuAKDAZ8kNgZpoOSz9fgUPoZCWn_r3Cez8ISQyBS4-A_lnufGCZ8A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtHBh6WxLPcKBFWJMFb4-i249207yi8kcKm0a-u6H6JtnUHQJVkFGdFkqZmEGTtxIqlgGMQIJRikmmJJiLaSq4hWUSaT7XWR5uGoil8w7DxUVlbw2-bvoWK3w2oyvaFqNqVTXxb6Jc4zP9oHFUePSFMU34-WIJvoTtB8sdfFWpK0DAN9unNTa7dpquZf3dZHRqIXZpkgDfP9E3RXQSPz8k76eSCXOq_c12wCAU2JNamxyMBVWJ2xbzl1E9-PfURwstEsRfBpxH2vA",
    ],
    extraRegistrations: 12,
    attendees: [
      {
        id: "1",
        name: "Sarah Kone",
        level: "L3 Informatique",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAJP3CwO-29NVTrN5W7JqWeuywohIu0PSLbyDqMjxGAwjTIQduKBizV3dooLDNPr7NKnPLljEvYtS1VNL7-0WX-pNlK1KNhbLv84uMEATJU4zm9PIbjJ1nc5N1-rsUFaTJYc9y90H-W4cg-h2SAknPwvJ2pa76SG5z0lSIkzUXRAtNoabJ6a_tnfAxlqxgrFcKpc_MtvUhsnem4tI7us-zpGivrEh13e_qxrni05I3990RA4CCiDw78MeeLONRZHvFyKmzw1jJ83UU",
      },
      {
        id: "2",
        name: "Moussa Traoré",
        level: "M1 Cybersécurité",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCRYTeQQcELO-X3zEkwFQPgdO1gSfDlVKka_ZHtXOD4RfKaYP_mtlO8DEyKYV91qZa5UlxrDovmn1Zmv_dQVIRXpq7esVAkt9Pcm5KOd_lRbY7plThqqVCxDDHfBzPjM6MrGcFt7NZaAGMBJ6NXpuCqwY34fFUBs5pp8W5NJyGElKLpvTi9z9cH_FgnPndXAuU2FJz2n5p9r3zlX4PrQlOPEPpQUY41sQbWo-T0FiS3np9dK1Prgmne3YyEFnMZxxM34saiUXU1fxI",
      },
      {
        id: "3",
        name: "Jean Dupont",
        level: "L2 Génie logiciel",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAsrUwsKq92pq-Nym3AG6Gxzu0DXCfCd7V7M8MHX3rHqRBnX_4WlOVEp8m_qncCMwP9Xw2HuHNQvXjgy394pINBDv6h4BlizTUu6758yoLZgzFTTfTLjl5PxRZOfqoFEIVCndWA8uj853F3OYexNtbJaOqJGbpU7Qy9l7WNnZf9QZGvkyczYl_dPP8CS9taepi7OV6BG2ZQyq6gxN8x8FRTu67srcEQSOfl_1bvip5cNyLDNLKCPOQsmodXNN2EdF9xClWygA92QGU",
      },
    ],
  },
  {
    id: "cyber-night",
    title: "CyberSecurity Night 2024",
    description:
      "Une nuit intensive dédiée à la cybersécurité, aux CTF et aux bonnes pratiques de sécurisation applicative.",
    month: "NOV",
    day: 2,
    dateHighlight: "neutral",
    time: "09:00 - 21:00",
    location: "Centre d'innovation",
    type: "hackathon",
    typeLabel: "Hackathon",
    typeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    capacity: 80,
    registered: 46,
    status: "Ouvert",
    statusClass: "text-on-secondary-container",
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnCQKHdM6ruqb_xwSLa409hBjO-3sJyFLraK6oT7syl_PnCahy4y07e6MOJhFjv7VqddrSwuKwUIVdh8vk2dIqokUwVJoh_g_hR_fMwqwRAxtHY-EcbiJoukoBkHK5q9HPCHBYcGw6u5pkgTFCF1QPUQ3IfHnUssoOC1i3TyiwafNq_xGWuk_GpTuJsEDWR0DjP4sSIrUif0iVTWQrcI4ccPZWqZOkjqKd1ty0y3Okmh58zUwUBW0pT0OP48GM0tvpPYZnpQPz3A",
    registrationAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaAsVFbamMyQQm6wHwOrS8IlHwJHSJdew8pdH_evWTdu8axh2y-P3O_RYiu9fJKi8NCZLFvfml8jWII8nLo9vm52gIISbgvQ7_J15fJX9ZaDsi5xkxGabCzFhNQLHmggmIDdR2t-yn9z5zCdR2-wXAwYcWwaSeob0Wa_VovoOkd8vTHCp8hrgt2_l8GuflpQkXQSNXsI6vs4Pr_YpuQOAXk-FAcmNYNR2YVzwREARrDbVgRl1odJQtaT8hZafTSKgvbFoL9jhBIEA",
    ],
    extraRegistrations: 45,
    extraRegistrationClass: "bg-secondary text-on-secondary",
    attendees: [],
  },
];

export const EVENT_TYPE_OPTIONS = [
  { value: "workshop", label: "Atelier" },
  { value: "hackathon", label: "Hackathon" },
  { value: "networking", label: "Networking" },
  { value: "lecture", label: "Conférence invitée" },
] as const;
