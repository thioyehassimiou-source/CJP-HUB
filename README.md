# CJP Hub

Plateforme numérique du **Club des Jeunes Programmeurs (CJP)** — Université de Labé, Guinée.

## Stack

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 19 + Vite + React Router + Tailwind CSS 4 |
| **Backend** | Node.js + Express 5 |
| **Base de données** | PostgreSQL + Prisma ORM |

## Structure

```
CJP HUB/
├── frontend/          # SPA React (port 5173)
│   └── src/
│       ├── pages/         # Routes React Router
│       ├── features/      # Modules métier (6 pôles)
│       ├── components/    # Layout & UI partagés
│       └── lib/           # Navigation, API client
├── backend/           # API REST Express (port 4000)
│   ├── prisma/            # Schéma PostgreSQL
│   └── src/
│       ├── routes/        # Endpoints /api/*
│       ├── middleware/
│       └── lib/           # Prisma, RBAC
└── docs/              # Documentation projet
```

## Prérequis

- Node.js 20+
- PostgreSQL 14+ (local ou Docker)

### PostgreSQL avec Docker (optionnel)

```bash
docker run --name cjp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cjp_hub \
  -p 5432:5432 -d postgres:16
```

## Démarrage

```bash
npm install

# Backend
cp backend/.env.example backend/.env
# Éditer DATABASE_URL si besoin

npm run db:generate
npm run db:push
npm run db:seed

# Frontend + Backend en parallèle
npm run dev
```

- Frontend : [http://localhost:5173](http://localhost:5173)
- API : [http://localhost:4000/api/health](http://localhost:4000/api/health)

**Comptes seed** (après `npm run db:seed`) :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@cjp.ul.edu.gn` | `admin123` | ADMINISTRATEUR |
| `membre@cjp.ul.edu.gn` | `membre123` | MEMBRE (actif, cotisation payée) |
| `pending@cjp.ul.edu.gn` | `membre123` | MEMBRE (adhésion PENDING) |

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Frontend + Backend simultanés |
| `npm run dev:frontend` | Vite seul |
| `npm run dev:backend` | Express seul |
| `npm run build` | Build frontend + vérif TypeScript backend |
| `npm run db:migrate` | Migrations Prisma (prod) |
| `npm run db:push` | Sync schéma (dev) |
| `npm run db:seed` | Données de démo |

## Routes frontend

| URL | Module |
|-----|--------|
| `/` | Accueil (stats live) |
| `/connexion`, `/inscription` | Auth |
| `/membres` | Annuaire public |
| `/formations`, `/evenements`, `/tresorerie` | Pages publiques |
| `/dashboard` | Tableau de bord (métriques live) |
| `/dashboard/formations` | Académie |
| `/dashboard/evenements` | Événements |
| `/dashboard/tresorerie` | Trésorerie |
| `/dashboard/tresorerie/paiement` | Paiement cotisation |
| `/dashboard/projets` | Portfolio |
| `/dashboard/projets/nouveau` | Nouveau projet |
| `/dashboard/bibliotheque` | Bibliothèque |
| `/dashboard/admin` | Documents (`?tab=affiches`) |

## API REST

Le proxy Vite redirige `/api/*` vers Express (`localhost:4000`).

### Santé & auth

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/health` | — | Statut API + connexion PostgreSQL |
| POST | `/api/auth/login` | — | Connexion (JWT) |
| POST | `/api/auth/register` | — | Pré-inscription membre (`PENDING`) |
| GET | `/api/auth/me` | Bearer | Profil connecté |

### Membres

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/members` | — | Annuaire membres `ACTIVE` |
| GET | `/api/members/pending` | Admin+ | Inscriptions en attente |
| PATCH | `/api/members/:userId/validate` | Admin+ | Approuver ou rejeter (`approve` / `reject`) |

### Formations & événements

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/formations` | — | Formations publiées |
| POST | `/api/formations` | Formateur+ | Créer une formation |
| GET | `/api/events` | Optionnel | Événements (`?manage=1` pour bureau) |
| POST | `/api/events` | Responsable+ | Créer un événement |
| POST | `/api/events/:id/register` | Membre actif | S'inscrire à un événement |

### Trésorerie

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/finance/summary` | — | Solde, recettes, dépenses, graphique |
| GET | `/api/finance/transactions` | — | Historique des transactions |
| GET | `/api/finance/cotisations/me` | Bearer | Cotisation de l'année en cours |
| POST | `/api/finance/transactions` | Trésorier+ | Saisir recette ou dépense |
| POST | `/api/finance/cotisations` | Bearer | Enregistrer cotisation (simulation) |

### Projets & bibliothèque

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/projects` | Optionnel | Portfolio public (`?mine=1` pour ses projets) |
| POST | `/api/projects` | Membre actif | Créer un projet |
| GET | `/api/resources` | — | Ressources publiées |
| POST | `/api/resources` | Membre actif | Importer une ressource |

### Statistiques

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/stats/overview` | — | Métriques dashboard (membres, finance, prochain événement…) |

## Checklist tests manuels (MVP)

1. **Santé** — `GET /api/health` retourne `ok` et `database: connected`
2. **Inscription** — créer un compte avec matricule UL (`ABCD1234567890`) et e-mail `@gmail.com` → statut `PENDING`
3. **Connexion admin** — `admin@cjp.ul.edu.gn` → dashboard avec métriques live et inscriptions en attente
4. **Validation membre** — approuver `pending@cjp.ul.edu.gn` depuis le tableau de bord
5. **Annuaire** — `/membres` affiche les membres actifs
6. **Formations / événements** — pages publiques et dashboard alimentés par l'API
7. **Inscription événement** — membre actif s'inscrit à un événement publié
8. **Cotisation** — membre actif paie via `/dashboard/tresorerie/paiement` (simulation)
9. **Trésorerie bureau** — trésorier/admin saisit une transaction
10. **Projet** — membre actif crée un projet ; membre `PENDING` reçoit une erreur 403
11. **Bibliothèque** — import ressource (membre actif) + liste dashboard
12. **Accueil** — compteurs hero et bandeau stats reflètent le seed

Voir le plan détaillé : [`docs/MVP-PLAN.md`](docs/MVP-PLAN.md)

---

CJP Hub — Université de Labé — 2026
