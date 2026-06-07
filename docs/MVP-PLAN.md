# CJP Hub — Plan MVP fonctionnel

> Objectif : passer de l’UI mockée à une plateforme **connectée** (React ↔ Express ↔ PostgreSQL) avec les parcours essentiels du club.

---

## État actuel (MVP — phases A à F terminées)

| Couche | État |
|--------|------|
| Frontend | Pages publiques + dashboard connectés à l'API REST |
| Backend | Express + Prisma — auth, membres, formations, événements, finance, projets, ressources, stats |
| Base | PostgreSQL avec seed reproductible (3 comptes, formations, événements, transactions…) |
| RBAC | JWT + rôles Prisma + adhésion active pour création projet/ressource |

---

## Périmètre MVP (Minimum Viable Product)

Le MVP couvre **6 pôles** avec des parcours réels, pas seulement de l’affichage :

### Parcours utilisateur (membre)

1. **Inscription** → compte + adhésion `PENDING`
2. **Connexion** → session JWT, accès dashboard
3. **Profil / paramètres** → lire et modifier ses infos
4. **Formations** → liste publique + catalogue dashboard (données API)
5. **Événements** → liste publique + inscription à un événement
6. **Cotisation** → enregistrement paiement (simulation) + statut cotisation
7. **Projets** → créer un projet, le voir sur son portfolio
8. **Bibliothèque** → lister les ressources publiées

### Parcours admin / bureau

1. **Valider / rejeter** les inscriptions en attente
2. **Publier** formations et événements
3. **Saisir** recettes et dépenses (trésorerie)
4. **Tableau de bord** → métriques live (membres actifs, cotisations, événements)

### Hors MVP (v2)

- Messagerie temps réel, paiement Orange Money réel, quiz/certificats automatiques, génération PDF attestations, notifications push, PWA offline.

---

## Architecture cible

```
Frontend (React)
  lib/api/client.ts     → fetch + JWT
  features/*/hooks      → useQuery par module
  AuthProvider          → session globale

Backend (Express)
  /api/auth/*           → login, register, me
  /api/members/*        → annuaire, validation admin
  /api/formations/*
  /api/events/*
  /api/finance/*
  /api/projects/*
  /api/resources/*
  /api/stats/*          → widgets dashboard

PostgreSQL (Prisma)
  schema.prisma         → source de vérité
  seed.ts               → jeu de démo reproductible
```

---

## Phases d’implémentation

### Phase A — Fondations (Semaine 1) ✅

### Phase B — Membres & annuaire (Semaine 2) ✅

### Phase C — Formations & événements (Semaine 3) ✅

### Phase D — Trésorerie (Semaine 4) ✅

### Phase E — Projets & bibliothèque (Semaine 5) ✅

### Phase F — Finition MVP (Semaine 6) ✅

---

## Modèle de données (rappel)

```
User ── Membership (PENDING → ACTIVE)
User ── Cotisation (UNPAID → PAID)
User ── EventRegistration ── Event
User ── ProjectMember ── Project
User ── Resource (upload)
User ── Transaction (createdBy)
Formation ── Certificate / Quiz
```

---

## Sécurité MVP

- Mots de passe : `bcrypt` (10 rounds)
- Session : JWT Bearer, expiration 7 jours
- CORS : origin frontend uniquement
- RBAC : rôles Prisma + middleware `requireRole`
- Validation : champs requis côté API (Zod en v2)

Variables d’environnement :

```env
# backend/.env
DATABASE_URL=postgresql://...
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Commandes de démarrage

```bash
# PostgreSQL (Docker)
docker run --name cjp-postgres \
  -e POSTGRES_USER=cjp \
  -e POSTGRES_PASSWORD=cjp_dev_password \
  -e POSTGRES_DB=cjp_hub \
  -p 5432:5432 -d postgres:16

npm install
npm run db:push
npm run db:seed
npm run dev
```

Comptes seed (après Phase A) :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@cjp.ul.edu.gn | admin123 | ADMINISTRATEUR |
| membre@cjp.ul.edu.gn | membre123 | MEMBRE (actif) |

---

## Prochaine étape (v2)

- Messagerie temps réel, paiement Orange Money, certificats automatiques, notifications push

---

*CJP Hub — Université de Labé — 2026*
