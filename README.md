# Verdo · EcoStay MVP

> MVP d'application d'éco-tourisme : catalogue de séjours responsables + carte interactive + filtres, sur une stack **Django REST Framework** + **React / TypeScript / TanStack Query**.

---

## 🎯 Objectif du projet

Verdo me sert de **terrain d'entraînement full-stack** :

- modéliser des données de séjours / catégories,
- exposer une **API REST** filtrable,
- consommer cette API dans un **frontend React** moderne,
- travailler l’UX (navigation, carte, filtres, responsive).

Ce n’est pas un produit fini, mais un **MVP pédagogique** que j’utilise comme vitrine de mon travail.

---

## Fonctionnalités principales

### Côté utilisateur

- Page d’accueil avec :
  - **liste de séjours** (titre, ville, prix, badge “démo”…),
  - **carte interactive** (Leaflet) synchronisée avec la liste,
  - **filtres par catégories** (multi-sélection),
  - **recherche textuelle** (barre de recherche en haut de la page).
- Navigation par sections :
  - Découverte (`/decouverte/...`),
  - Impact (`/impact/...`),
  - Communauté (`/communaute/...`),
  - Espace futur (`/monespace`).
- Mise en page responsive et style “éco-tourisme” (tailwind-like).

### Côté back-office

- Interface **Django admin** pour gérer :
  - les **catégories** (nom FR/EN, slug auto),
  - les **séjours** (titre, ville, prix, catégorie, coordonnées, flag `is_demo`).
- Actions personnalisées dans l’admin :
  - “Marquer comme démo” / “Retirer le marqueur démo”.
- Optimisations simples :
  - `select_related("category")` dans l’admin pour limiter les requêtes,
  - annotation du **nombre de séjours par catégorie** (`stays_count`).

---

## Stack technique

### Backend (API)

- **Python 3.x**
- **Django 4.x**
- **Django REST Framework**
- Base de données SQL (SQLite en dev, PostgreSQL possible en prod)
- Modèles principaux :
  - `Category` : `name_fr`, `name_en`, `slug` (généré automatiquement).
  - `Stay` : `title`, `city`, `price`, `latitude`, `longitude`, `category`, `is_demo`, `created_at`, etc.
- Sérialisation :
  - `CategorySerializer` avec champ calculé `stays_count`.
  - `StaySerializer` avec :
    - catégorie imbriquée en lecture,
    - champ `category_id` pour la création / mise à jour.
- Vues :
  - `CategoryViewSet` (lecture seule, recherche + tri DRF).
  - `StayViewSet` (CRUD + filtres via query string).
- Routing :
  - `router.register("stays", StayViewSet, ...)` → `/stays/`, `/stays/{id}/`
  - `router.register("categories", CategoryViewSet, ...)` → `/categories/`

### Frontend (SPA)

- **React 18**
- **TypeScript**
- **Vite**
- **React Router** (`createBrowserRouter`)
- **@tanstack/react-query** (TanStack Query) pour le data-fetching
- **Tailwind-like CSS** (classes utilitaires)
- **React-Leaflet + Leaflet** pour la carte

Organisation (extraits) :

- Pages :
  - `src/pages/home/HomePage.tsx` : page d’accueil (carte + liste + filtres).
- Composants UI :
  - `src/components/StayCard.tsx` : carte d’un séjour.
  - `src/components/StayMap.tsx` : carte Leaflet (fit-to-bounds + focus sur le séjour sélectionné).
  - `src/components/CategoryFilter.tsx` : filtres de catégories (multi-sélection).
  - `src/components/Header.tsx` & `Submenu.tsx` : navigation principale avec sous-menus.
  - `PageHero`, `FeaturedStory`, `MissionTeaser` : blocs éditoriaux.
- Hooks :
  - `src/hooks/useStays.ts` : récupération de la liste / du détail d’un séjour (TanStack Query).
  - `src/hooks/useCategories.ts` : récupération des catégories.
- Services :
  - `src/services/stays.ts`, `src/services/categories.ts` :
    - client HTTP centralisé (`api`, basé sur Axios),
    - compatibilité tableau direct **ou** pagination DRF (`results`).

---

## 📡 API REST — exemples

> Le préfixe exact dépend de l’intégration dans le projet Django (ex. `/api/`), ici on note les chemins “bruts” enregistrés par DRF.

### Endpoints

- `GET /stays/` — liste des séjours.
- `GET /stays/{id}/` — détail d’un séjour.
- `GET /categories/` — liste des catégories (avec `stays_count`).

### Filtres disponibles sur `/stays/`

Tous les filtres passent par la query string :

- `city` — filtre par ville exacte  
  `GET /stays/?city=Brest`
- `category` — slug de catégorie  
  `GET /stays/?category=insolite`
- `min_price`, `max_price` — fourchette de prix  
  `GET /stays/?min_price=60&max_price=120`
- `is_demo` — ne garder que les séjours marqués comme démo  
  `GET /stays/?is_demo=1`
- `has_coords` — filtrer selon la présence de coordonnées GPS  
  `GET /stays/?has_coords=true`
- Recherche / tri (via `SearchFilter` / `OrderingFilter` DRF)  
  `GET /stays/?search=mer&ordering=price`

Les catégories sont annotées avec `stays_count`, ce qui permet d’afficher le **nombre de séjours par catégorie** dans le frontend.

---

## Lancer le projet en local

> Adapter les chemins (`backend/`, `frontend/`, etc.) selon la structure réelle du repo.

### 1. Backend Django

```bash
cd backend

python -m venv .venv
```
#### Windows
```bash
.venv\Scripts\activate
```
#### Linux / macOS
```bash
source .venv/bin/activate

pip install -r requirements.txt
```

#### Migrations
```bash
python manage.py migrate
```

#### (Optionnel) créer un superuser pour accéder à l’admin
```bash
python manage.py createsuperuser
```

#### Lancer le serveur de dev
```bash
python manage.py runserver
```

Par défaut : <http://127.0.0.1:8000/>

### 2. Frontend React

```bash
cd frontend
```

#### Installer les dépendances
```bash
npm install        # ou: pnpm install / yarn install
```

#### Lancer le serveur de dev Vite
```bash
npm run dev
```

Par défaut : http://localhost:5173/

Le frontend consomme l’API via un client HTTP (api) configuré pour pointer vers l’URL du backend (par exemple http://127.0.0.1:8000/).

### Idées d’amélioration

- Authentification / espace utilisateur (favoris, réservations).

- Formulaire complet de réservation / contact.

- Gestion avancée des médias (galeries photos par séjour).

- Multi-langue complet FR/EN.

- Tests unitaires + d’intégration (backend & frontend).

- Déploiement automatisé (CI/CD) sur une plateforme cloud.
