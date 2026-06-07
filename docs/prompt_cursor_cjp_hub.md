# Prompt Cursor — CJP Hub
## Contexte du projet

Tu vas développer **CJP Hub**, la plateforme numérique de gestion intégrée du **Club des Jeunes Programmeurs (CJP)** de l'Université de Labé, en Guinée.

Ce projet est une application web complète. Tu dois **impérativement respecter le design system officiel du CJP** décrit ci-dessous, afin que CJP Hub soit visuellement cohérent avec le site existant du club.

---

## 🎨 Design System officiel du CJP (à respecter strictement)

### Palette de couleurs
```css
:root {
  --cjp-black:    #0A0A0A;   /* Fond principal — noir profond */
  --cjp-dark:     #111111;   /* Fond secondaire — noir doux */
  --cjp-gray:     #1A1A1A;   /* Cartes, sections sombres */
  --cjp-gold:     #F5A623;   /* Couleur principale — or/ambre CJP */
  --cjp-gold-dark:#D4891A;   /* Or foncé — hover, accents */
  --cjp-white:    #FFFFFF;   /* Texte principal sur fond sombre */
  --cjp-offwhite: #F2F2F2;   /* Fond de pages claires */
  --cjp-text-muted: #9CA3AF; /* Texte secondaire */
  --cjp-border:   #2A2A2A;   /* Bordures subtiles */
}
```

### Typographie
- **Titres display** : police fine/light (`font-weight: 300`) pour les grandes phrases, combinée avec du **bold (`font-weight: 700-800`)** sur certains mots clés — effet typographique fort (exemple : "**Devenez** des meilleurs")
- **Corps de texte** : léger, aéré, `font-weight: 300-400`
- **Navigation & boutons** : UPPERCASE, `letter-spacing: 0.1em`
- Police recommandée : `'Barlow'`, `'Outfit'`, ou `'Plus Jakarta Sans'` (sans-serif moderne et propre)

### Navbar
```
Fond : --cjp-black (#0A0A0A)
Logo CJP (rond doré) à gauche
Liens nav : blanc, uppercase, légers — lien actif en --cjp-gold
Bouton CTA "ESPACE MEMBRE" à droite : fond --cjp-gold, texte noir, border-radius: 999px (pill), uppercase
Hauteur navbar : 64px
Position : sticky top
```

### Boutons
```css
/* Bouton primaire CJP */
.btn-cjp {
  background: var(--cjp-gold);
  color: #000;
  border-radius: 999px;        /* pill shape */
  padding: 14px 28px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Icône flèche dans le bouton */
.btn-cjp .arrow-icon {
  background: #000;
  color: var(--cjp-gold);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bouton outline (ex: "NOS ÉQUIPES →") */
.btn-cjp-outline {
  background: transparent;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

### Hero section (page d'accueil)
```
Fond : --cjp-black
Décoration de fond : motif géométrique de polygones/pentagones tracés en lignes fines grises (#333), effet wireframe, opacité faible
Titre : très grand (clamp 48px → 80px), combinaison thin + bold
Sous-titre : texte blanc léger, max-width 500px
CTA : 2-3 boutons pill dorés + 1 bouton outline
```

### Cartes (formations, événements, membres)
**Mode sombre (pages principales) :**
```
Fond : --cjp-gray (#1A1A1A)
Bordure : 1px solid --cjp-border
Border-radius : 12px
En-tête de carte : image B&W du formateur + bandeau avec nom en --cjp-gold
Titre de la carte : --cjp-gold, font-weight: 700
Détails (lieu, heure, places) : étiquette bold + valeur normale
```

**Mode clair (pages secondaires) :**
```
Fond : blanc
Ombre : box-shadow légère
Même structure de contenu
```

### Pages secondaires (Services, Événements…)
```
Fond : --cjp-offwhite (#F2F2F2)
Navbar : toujours noire
Typographie display : même style thin+bold, couleur noire/très sombre
Labels/accents : --cjp-gold
Liens "DÉTAIL →" : texte noir + cercle gris avec flèche
```

### Éléments décoratifs récurrents
- **Bandeau diagonal doré** dans le coin supérieur droit des cartes (triangle/chevron doré)
- **Motif polygonal** (wireframe géométrique) en fond des sections sombres
- **Cercle avec flèche** pour les boutons secondaires (outline)
- **Labels en or** pour les métadonnées (DATE, LIEU, HEURE…)

---

## 📐 Structure de navigation CJP Hub

La navbar de CJP Hub doit contenir :

```
[Logo CJP]  ACCUEIL  MEMBRES  FORMATIONS  ÉVÉNEMENTS  PROJETS  TRÉSORERIE  BIBLIOTHÈQUE  [ESPACE MEMBRE →]
```

---

## 🗂️ Pages à développer

### 1. Page d'accueil (`/`)
- Hero sombre avec motif géométrique polygonal en fond
- Titre : "**Gérez** tout avec CJP Hub" (style thin + bold)
- Sous-titre descriptif
- 3 boutons : "NOS FORMATIONS →", "REJOINDRE LE CLUB →", "TABLEAU DE BORD →"
- Section présentation des 6 pôles en cartes (icône + titre + description courte)
- Section statistiques : nombre de membres, formations, certifications, projets

### 2. Page Membres (`/membres`)
- Liste des membres avec carte : photo (ou avatar initiales), nom, filière, niveau, statut (actif/inactif)
- Badge "Membre actif" en doré
- Filtre par statut, filière, niveau
- Bouton "Nouvelle adhésion →"

### 3. Page Formations (`/formations`)
- Grille de cartes formations (style identique au site CJP existant)
- En-tête de carte : image formateur N&B + nom en doré
- Titre formation en doré
- Infos : Lieu, Heure, Nombre de places
- Bouton "S'inscrire →"

### 4. Page Événements (`/evenements`)
- Liste ou grille d'événements
- Affiche de l'événement à gauche + détails à droite (style site CJP)
- Label "DATE" en doré
- Titre, description tronquée, date de publication
- Lien "DÉTAIL →"

### 5. Page Trésorerie (`/tresorerie`)
- Fond clair (--cjp-offwhite)
- Cards : Recettes totales / Dépenses totales / Solde actuel (valeurs en doré)
- Tableau historique des transactions (date, libellé, montant, catégorie, pièce jointe)
- Graphique simple recettes vs dépenses

### 6. Dashboard admin (`/dashboard`)
- Fond sombre
- Widgets : membres actifs, cotisations reçues, formations à venir, certificats générés
- Accès rapide aux 6 pôles

---

## ⚙️ Stack technique recommandée

```
Frontend  : React + Vite
Styles    : Tailwind CSS (avec variables CSS custom pour le design CJP)
Routing   : React Router v6
Icons     : Lucide React
Charts    : Recharts
Auth      : JWT (à prévoir côté backend)
```

---

## ✅ Règles impératives

1. **Toutes les couleurs** doivent passer par les variables CSS définies ci-dessus — aucun code couleur en dur sauf dans les variables.
2. **La navbar** est toujours noire, sticky, avec le logo CJP rond à gauche et le bouton pill doré à droite.
3. **Les boutons CTA** sont toujours en pill (border-radius: 999px) avec l'icône flèche noire dans un cercle noir.
4. **Les titres** alternent entre texte fin (font-weight: 300) et texte gras (font-weight: 700+) sur la même ligne.
5. **Le fond des pages principales** (hero, dashboard) est noir (#0A0A0A). Les pages secondaires ont un fond clair (#F2F2F2).
6. L'application est **entièrement en français**.
7. Le nom affiché partout est **CJP Hub** — jamais "CJP Connect".

---

## 🚀 Par où commencer

Commence par :
1. Mettre en place le projet React + Vite + Tailwind
2. Créer le fichier `src/styles/cjp-tokens.css` avec toutes les variables CSS
3. Développer le composant `Navbar` réutilisable
4. Développer la page d'accueil complète
5. Ensuite enchaîner les pages dans l'ordre : Formations → Événements → Membres → Trésorerie → Dashboard
