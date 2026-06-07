export const ADMIN_METRICS = [
  {
    id: "members",
    label: "Membres totaux",
    value: "1 248",
    trend: "+12%",
    trendUp: true,
    icon: "groups",
    iconClass: "bg-primary-container text-white",
  },
  {
    id: "active",
    label: "Membres actifs",
    value: "842",
    trend: "+5%",
    trendUp: true,
    icon: "bolt",
    iconClass: "bg-secondary-container text-secondary",
    filled: true,
  },
  {
    id: "balance",
    label: "Solde total",
    value: "42 150 000 GNF",
    trend: "-2%",
    trendUp: false,
    icon: "account_balance_wallet",
    iconClass: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    id: "events",
    label: "Événements à venir",
    value: "14",
    icon: "calendar_month",
    iconClass: "bg-surface-container-highest text-primary",
  },
] as const;

export const CJP_DASHBOARD_METRICS = [
  {
    id: "active",
    label: "Membres actifs",
    value: "842",
    trend: "+5%",
    trendUp: true,
  },
  {
    id: "contributions",
    label: "Cotisations reçues",
    value: "8 450 000 GNF",
    trend: "+18%",
    trendUp: true,
  },
  {
    id: "courses",
    label: "Formations à venir",
    value: "6",
    trend: "2 cette semaine",
    trendUp: true,
  },
  {
    id: "certificates",
    label: "Certificats générés",
    value: "127",
    trend: "+24",
    trendUp: true,
  },
] as const;

export const CJP_DASHBOARD_POLES = [
  { id: "membres", title: "Membres", href: "/membres", icon: "Users" },
  { id: "formations", title: "Formations", href: "/dashboard/formations", icon: "GraduationCap" },
  { id: "evenements", title: "Événements", href: "/dashboard/evenements", icon: "CalendarDays" },
  { id: "projets", title: "Projets", href: "/dashboard/projets", icon: "FolderKanban" },
  { id: "tresorerie", title: "Trésorerie", href: "/dashboard/tresorerie", icon: "Wallet" },
  { id: "bibliotheque", title: "Bibliothèque", href: "/dashboard/bibliotheque", icon: "Library" },
] as const;

export const MEMBER_GROWTH = [
  { month: "JAN", height: 40, opacity: "opacity-20" },
  { month: "FÉV", height: 55, opacity: "opacity-30" },
  { month: "MAR", height: 75, opacity: "opacity-50" },
  { month: "AVR", height: 65, opacity: "opacity-70" },
  { month: "MAI", height: 90, opacity: "opacity-90" },
  { month: "JUN", height: 82, opacity: "" },
];

export const RECENT_ACTIVITIES = [
  {
    id: "1",
    type: "registration",
    title: "Nouvelle inscription : Felix Schmidt",
    subtitle: 'A rejoint l\'atelier "Python avancé"',
    time: "Il y a 10 min",
    borderClass: "border-outline-variant",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhWy0pU0qEoCRa1MdnpiBC9Gz4zLpGWY5E6eOY9mKMlCvRTAm1mHs1UDelErz88gZeR-4PUOtnV4KMRbgADxQw00P9l3NltxAvMOx1pXbFFfW-dv41LmZHJDtqtGXVB3ZUKNUSq9LDQx353JnCc4irQ0Jr1l4eLYoj-YAI2qpaOMoCn7BGMNIDS7g79lTNRHdTFxeP_un_RwXWBko5uwRwCQzgYn4ZYQz8SvbBU4f1jAdt1AAOOmBQ_qu8gSFJgYg9cnzDoqgQFVo",
  },
  {
    id: "2",
    type: "payment",
    title: "Paiement confirmé : 450 000 GNF",
    subtitle: "Sarah Miller — Renouvellement d'adhésion",
    time: "Il y a 2 h",
    borderClass: "border-outline-variant",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0I26-HE51FHFnaXSR_FulZx-HbGMxNL0GI7lBtaqYhr_7KFG29HC5qA1cDPYrsBYTLMn1QrSKJUQ_7Yp9JnRJ9Lrn_DTKXKaLqkiIt0WLV1zr7CFC8TddEKmANmTwOP9yerGw4yG8-xF8wMxz1CG_QGvfTV9Z4vUl2EdqO__bHoKowrrgqIVl8SfWW6BJ5M3TqjIuKSIg23C7CU26pVFAHspzj8nnjZnGJH4RsamJ96vzzI9lhzxfTw5W-bQtsaQyWfpC-aghOVU",
  },
  {
    id: "3",
    type: "event",
    title: "Événement publié",
    subtitle: '"HackTheHub 2024" est en ligne.',
    time: "Il y a 4 h",
    borderClass: "border-secondary",
    icon: "rocket_launch",
    iconClass: "bg-secondary text-on-secondary",
  },
  {
    id: "4",
    type: "badge",
    title: "Nouveau badge obtenu",
    subtitle: 'Marco Silva a obtenu "Maître C++".',
    time: "Hier",
    borderClass: "border-outline-variant",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDcRJNnKqrepSIbKwCSM9588-RJ7r-iN1ZPC5lNrf21h0qT1RtqZvyU0hBGeDkw5xPStXV_OS5zd3tLCeH4JVD0uZg9a7cbX3XNAgX3vef8pSeJX-IgLZGP_Uu5HF3gEvfPTp925Ms8ruy5nRDlV-tV5ZD_h01v8vyKbF8ch9oTS3GI-47WhEMlzLQ8fMIky448mqsjpEMdQQmNCAvQCXt9wELpeJGQthk_nLIbG0-AajragYIDw0Br6f6sMGPtWDeMeeVepwRUJ8",
  },
];

export const QUICK_ACTIONS = [
  { id: "member", label: "Nouveau membre", icon: "person_add", className: "bg-primary-container text-white hover:brightness-125" },
  { id: "event", label: "Créer un événement", icon: "post_add", className: "bg-secondary text-white hover:brightness-110" },
  { id: "invoice", label: "Facturation", icon: "receipt_long", className: "border border-outline-variant bg-surface-container-highest text-primary hover:bg-surface-variant" },
  { id: "blast", label: "Envoyer un message", icon: "campaign", className: "border border-outline-variant bg-surface-container-highest text-primary hover:bg-surface-variant" },
];

export const PENDING_REGISTRATIONS = [
  {
    id: "1",
    initials: "JS",
    name: "Julianne Smith",
    initialsClass: "bg-secondary-container text-secondary",
    department: "Informatique",
    date: "24 oct. 2023",
    status: "verified",
    statusLabel: "Vérifié",
    statusClass: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "2",
    initials: "AM",
    name: "Arthur Morgan",
    initialsClass: "bg-primary-container text-white",
    department: "Génie logiciel",
    date: "23 oct. 2023",
    status: "pending",
    statusLabel: "En attente",
    statusClass: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    id: "3",
    initials: "LW",
    name: "Lucas White",
    initialsClass: "bg-surface-container-highest text-primary",
    department: "Analyse de données",
    date: "22 oct. 2023",
    status: "verified",
    statusLabel: "Vérifié",
    statusClass: "bg-secondary-container text-on-secondary-container",
  },
];

export const FEATURED_EVENT = {
  title: "Hackathon CJP Hiver",
  badge: "Prochain événement majeur",
  dates: "12-14 déc.",
  location: "Labo principal du campus",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsiYkZUygy-y3Z-jugi3DS2QoWsCAE0efXydSc2OUALO9NBvsnEBNr7sNdVqCLD-vG0lTntYLaVB03GKdyCueUtIYbUrAsXv-tLqrTFJ1ilAhjqJjIJqjIoz2KfPYl4rDz8RZ1Is3Jhv9MjZY3Al5pscYnbeSHaxK2umxA2OuJRFuJfQrjWwQlL0SBJCsgkAb53jd20Me7ED88TqWpO_GEYgSEhQdn1RiZD2HVoo3kRW5eWrCP28bzV6ntIxSvkToXbWgZUL2uc0k",
  attendees: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFI902u6hWfZK8KpWtLOz83VshwFMMzxY6RCv1f3kLwEjwjYAumOseKTJnthekVicgRJiu9RSwXfqlYXPI1dhffvBw19WC4ywEF9b_a_ENQyQIuThAkqpImxTbQG0QBnQEQL-WdXqo1Y4AWF_c-M8nygCAuc2YWxIOH8RIiZy-S9BsGyoXQkxQFcQvK029wCu8WhP3J628Vc9WZ8uExeElaGQqMsYdrvaS_D99y3n3-r0lCZqEn8CMQMVT19MHxdslqbBLQmgvkis",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD35skN7X9pWdR4j9vmDXazP0KscQ8YK8H2D7qro6Ln-3FqeUz48o26KQgEVaGAgSvwQQAyUQy_flGaNKaLZeYxUVJNFfqlSjjeQG0gCxWO86kXhvfzrD2ik7GnfXcSMLxV5BJTW2ipGmaXky5u0ig_PgPRwt96SY9HSwMYvCFhSrewHOL3ovgZ-BqkI75HQJ1xkqnh0HTRBFQQ2Thm_VJAICRB3ArRBlvSlTnwixsLeuGWMYgNsiJPmNelyW4GtYdrVvmn2p2sto0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFOQk4HMEcLLC-h2gTcTD7NAMgSgfjebvw_u8mPHqkVub7D2VsfXQytWdYOTwIAVBH3yEU4Ds08I1oFcqZEBomFT45ZflRJ5A9b-pP8YAhTuF1KAqO9h9vqsM-jH48BVF-yktLyEKErp_JL7SnOJ4C6k08KzyTvqO0YYVMw4z1twu3fvRE5bxrWk6Q7VlFBvBEN-5C-pWyIZPp1KLsPVBD7rj_9WB3cr9CPv8zWidp1k0UKUeBTKqWaqekvJUk53qQnKwdThknOw",
  ],
  extraAttendees: 142,
};

export const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAvCy7eyTPwUUGhGv60eM6K-aY9b8eEus1qX0K67zwx8vXJvcquIlaaKhUxAWlsq8kYPARBtMOjOomMBAwuvLzcjfCIuZJxPnR7ePICq5VKPAupNVZDe0_jK5qbc6W0FqRXUhGEvMo3RkfFSugTyQ5RX4rqJTCvnmTDMbLbzLSMpG_Ay1VFWFv2etdmIgOADhL1zt1yPyo1XCeNcBn6zZXhs8r2kJFlugnJaN2PniulpBJabrXVRF_fhSVP-ibgoBc-gQy1Y2x8DcU";
