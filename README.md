# ArtisanBF

Plateforme geolocalisée pour les artisans locaux du Burkina Faso.

## Description

ArtisanBF connecte les artisans à leurs clients via un annuaire géolocalisé, avec des outils d’intelligence artificielle pour :

- l’analyse de commentaires (sentiment, pertinence, note)
- le résumé de commentaires
- la recherche vocale (catégorie/quartier/urgence)

## Architecture (monorepo)

- **frontend/** : application Next.js 16 / React 19 (pages publiques + dashboard), port 3000. Nom de package : `frontend`.
- **backend/** : API Next.js 14 / React 18 (routes `/api/*`, documentation Swagger, intégrations IA), port 3001. Nom de package : `artisanbf`.

> ⚠️ Le backend est à la racine `backend/` (le nom **de package** est `artisanbf`). Il n'existe **pas** de dossier `backend/artisanbf/`.

Le frontend communique avec le backend via des **rewrites Next.js** (proxy) configurés dans `frontend/next.config.ts` (env `NEXT_PUBLIC_BACKEND_URL`, avec compatibilité `BACKEND_URL`). Sont proxyfiés : `/api/ai/*`, `/api/commerces`, `/api/categories`, `/api/avis/*`, `/api/auth/*`, `/api/recherche`, `/api/geocoding`. Seul `/api/photos` (Pexels) est servi localement par le frontend.

## Base de données (Supabase)

Le schéma est versionné dans `backend/supabase/migrations/` (ordre = dépendances de clés étrangères) :

- `000_create_utilisateurs.sql`
- `001_create_categories.sql`
- `002_create_commerces.sql`
- `003_create_avis.sql`

> Les migrations créent le schéma mais aucune donnée : la base est vide au premier démarrage (pas de seed).

## Démarrage (dev)

Depuis la racine du monorepo :

```bash
# Lancer le frontend (port 3000)
npm run dev:frontend

# Lancer le backend (port 3001)
npm run dev:backend
```

Scripts disponibles (root) :

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build --workspaces --if-present`
- `npm run lint --workspaces --if-present`

## Variables d’environnement

### Frontend (frontend/.env.local)
Copier `frontend/.env.local.example` vers `frontend/.env.local`, puis renseigner :

> Note : les appels IA (`/api/ai/*`) sont routés vers le backend via `frontend/next.config.ts` (env `NEXT_PUBLIC_BACKEND_URL`, avec compatibilité `BACKEND_URL`).
> Vérifier que `NEXT_PUBLIC_BACKEND_URL` pointe bien vers le backend (ex : `http://localhost:3001`).

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BACKEND_URL` (ex : `http://localhost:3001`)
- `BACKEND_URL` (alias compatible, facultatif)
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` (utilisés par le proxy)
- `PEXELS_API_KEY` (photos)

### Backend (backend/.env)
Copier `backend/.env.example` vers `backend/.env`. Le backend utilise notamment :
- `AI_MODEL` (ex: `llama-3.1-8b-instant`)
- `AI_BASE_URL`
- `AI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (accès Supabase côté serveur)

> Ces variables doivent correspondre à celles utilisées par `backend/src/lib/ia/client`.


## API (backend)

Routes IA :
- `POST /api/ai/analyze`
- `POST /api/ai/summarize`
- `POST /api/ai/voice-search`
- `POST /api/ai/speech-to-text`

Routes métier :
- `GET|POST /api/commerces`, `GET|PUT|DELETE /api/commerces/[id]`
- `GET /api/categories`
- `GET|POST /api/avis`, `DELETE /api/avis/[id]`
- `POST /api/auth/connexion`, `POST /api/auth/inscription`
- `GET /api/recherche` (recherche + tri géolocalisé par distance)
- `GET|POST /api/geocoding` (géocodage direct / inverse via Nominatim)

Documentation :
- Swagger statique : `backend/public/swagger.html`
- Page docs : `/api-docs` (généré via `backend/lib/swagger.js`)

## Branches

| Branche | Description |
|---|---|
| `main` | Produit final |
| `IA` | Module d’intelligence artificielle |
| `frontend` | Interface utilisateur |

