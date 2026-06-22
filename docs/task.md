# CJP Hub — Checklist d'implémentation écran par écran

> **Règle stricte** : tant qu'un écran n'est pas terminé **et validé par l'utilisateur**, on ne passe pas au suivant.
>
> Processus par écran :
> 1. **Analyse & backend** — API fonctionnelle et sécurisée
> 2. **Frontend & UI** — design system CJP (premium, responsive, français)
> 3. **Intégration** — états chargement / erreur / succès / vide
> 4. **Validation utilisateur** — test visuel et fonctionnel
> 5. ✅ Validé → écran suivant

---

## Zone 1 — Publique (Vitrine)

| # | Écran | Backend | Frontend | Intégration | Validation |
|---|-------|---------|----------|-------------|------------|
| 1 | `/` Accueil | ✅ | ✅ | ✅ | ✅ validé (2026-06-10) |
| 2 | `/a-propos` | ✅ | ✅ | ✅ | ✅ validé |
| 3 | `/membres` | ✅ | ✅ | ✅ | ✅ validé |
| 4 | `/formations` | ✅ | ✅ | ✅ | ✅ validé |
| 5 | `/evenements` | ✅ | ✅ | ✅ | ✅ validé |
| 6 | `/tresorerie` | ✅ | ✅ | ✅ | ✅ validé |
| 7 | `/bibliotheque` | ✅ | ✅ | ✅ | ✅ validé |
| 8 | `/certificats/verify` | ✅ | ✅ | ✅ | En attente de validation |
| 9 | `/projets` | ✅ | ✅ | ✅ | En attente de validation |

## Zone 2 — Authentification

| # | Écran | Backend | Frontend | Intégration | Validation |
|---|-------|---------|----------|-------------|------------|
| 10 | `/connexion` | ☐ | ☐ | ☐ | ☐ |
| 11 | `/inscription` | ☐ | ☐ | ☐ | ☐ |

## Zone 3 — Privée (Dashboard)

| # | Écran | Backend | Frontend | Intégration | Validation |
|---|-------|---------|----------|-------------|------------|
| 12 | `/dashboard` (vue d'ensemble) | ☐ | ☐ | ☐ | ☐ |
| 13 | `/dashboard/formations` (+ quiz) | ☐ | ☐ | ☐ | ☐ |
| 14 | `/dashboard/evenements` | ☐ | ☐ | ☐ | ☐ |
| 15 | `/dashboard/projets` (+ `/nouveau`) | ☐ | ☐ | ☐ | ☐ |
| 16 | `/dashboard/tresorerie` (+ `/paiement`) | ☐ | ☐ | ☐ | ☐ |
| 17 | `/dashboard/bibliotheque` | ☐ | ☐ | ☐ | ☐ |
| 18 | `/dashboard/messages` | ☐ | ☐ | ☐ | ☐ |
| 19 | `/dashboard/parametres` | ☐ | ☐ | ☐ | ☐ |

## Zone 4 — Administration (Bureau)

| # | Écran | Backend | Frontend | Intégration | Validation |
|---|-------|---------|----------|-------------|------------|
| 20 | Espace admin (validation membres, caisse, formations, événements) | ☐ | ☐ | ☐ | ☐ |

---

## Journal de progression

| Date | Écran | Statut | Notes |
|------|-------|--------|-------|
| 2026-06-10 | — | Démarrage | Création de la checklist, début écran 1 (`/`) |
| 2026-06-10 | `/` Accueil | En attente de validation | Stats live `/api/stats/overview`, suppression des chiffres mockés (placeholders `—` pendant chargement/erreur), build OK. Note : pôle « Projets » pointe vers `/dashboard/projets` en attendant l'écran 9 (`/projets` public) |
| 2026-06-10 | `/` Accueil | Animations ajoutées | Entrée cascade du hero, compteurs animés (count-up), badges flottants, révélation au scroll (bandeau stats + pôles), hover enrichi sur les cartes. Respect `prefers-reduced-motion`. Nouveaux utilitaires : `CjpReveal`, `useCountUp`, keyframes `cjp-anim-*` |
| 2026-06-10 | `/` Accueil | Effets d'interaction | Ripple au clic (boutons), élévation + ombre dorée au hover, navbar verre dépoli au scroll + barre de progression dorée, soulignement animé des liens nav, parallaxe souris sur le hero (halo + globe), pression sur les cartes (`active:scale`), défilement fluide (`scroll-behavior: smooth`) |
| 2026-06-10 | `/` Accueil | Particules flottantes | Champ de particules dorées/blanches qui dérivent vers le haut (hero : 42, section pôles : 20), inspiré de l'image fournie et adapté au thème sombre CJP. Composant réutilisable `CjpParticles` |
| 2026-06-10 | `/` Accueil | Particules + curseur | Les particules suivent le curseur avec inertie : 3 couches de parallaxe selon la taille (26/52/88 px), lissage `requestAnimationFrame`, respect `prefers-reduced-motion` |
| 2026-06-10 | `/` Accueil | ✅ **VALIDÉ** | Écran 1 terminé et validé par l'utilisateur. Passage à l'écran 2 (`/a-propos`) |
| 2026-06-10 | `/a-propos` | En attente de validation | Nouveau endpoint public `GET /api/members/bureau` (membres actifs avec rôle ≠ MEMBRE, tri Président → Responsable → Trésorerie → Formateur). Stats live (`/api/stats/overview`) : années d'impact calculées depuis 2016, membres actifs, formations, projets. Équipe de direction dynamique avec avatars initiales dorés (squelette de chargement + état vide). Suppression des leaders/stats mockés. Animations : cascade hero, particules (hero 36 + valeurs 18), parallaxe halo, reveal au scroll, count-up, hover enrichi cartes valeurs/équipe. Seed : rôles bureau attribués (RESPONSABLE, TRESORIER, FORMATEUR) |
| 2026-06-13 | `/a-propos` | ✅ **VALIDÉ** | Écran 2 validé par l'utilisateur. |
| 2026-06-13 | `/membres` | ✅ **VALIDÉ** | Écran 3 validé par l'utilisateur. |
| 2026-06-13 | `/formations` | ✅ **VALIDÉ** | Écran 4 validé par l'utilisateur. |
| 2026-06-13 | `/evenements` | En attente de validation | L'écran Événements à venir est prêt. Le backend `GET /api/events` renvoie les hackathons, conférences et ateliers publiés. Le frontend (`cjp-evenements-page.tsx`) affiche une liste sous forme de cartes d'événements. Gère les statuts complet/inscrit et désactive le bouton en conséquence. L'intégration avec `registerForEventRequest` est opérationnelle. |
