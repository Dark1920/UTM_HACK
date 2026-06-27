# ArtisanBF

Plateforme geolocalisée pour les artisans locaux du Burkina Faso.

## Description

ArtisanBF connecte les artisans à leurs clients via un annuaire géolocalisé, avec des outils d’intelligence artificielle pour :

- l’analyse de commentaires (sentiment, pertinence, note)
- le résumé de commentaires
- la recherche vocale (catégorie/quartier/urgence)

## Architecture (monorepo)

- **frontend/** : application Next.js (pages publiques + dashboard)
- **backend/artisanbf/** : API Next.js (routes `/api/ai/*`, documentation Swagger, intégrations IA)

Le frontend communique avec le backend via des **rewrites Next.js** (proxy) sur `/api/ai/*`.

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

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BACKEND_URL` (ex: `http://localhost:3001`)
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` (utilisés par le proxy)
- `PEXELS_API_KEY` (photos)

### Backend (backend/artisanbf/.env)
Le backend utilise notamment :
- `AI_MODEL` (ex: `llama-3.1-8b-instant`)

> Les clés exactes sont à compléter selon `backend/artisanbf/.env.example` (ou `backend/.env.example` selon votre configuration).


## API AI (backend)

Routes principales (backend) :

- `POST /api/ai/analyze`
- `POST /api/ai/summarize`
- `POST /api/ai/voice-search`
- `POST /api/ai/speech-to-text`

Swagger :
- `backend/artisanbf/public/swagger.html`

## Branches

| Branche | Description |
|---|---|
| `main` | Produit final |
| `IA` | Module d’intelligence artificielle |
| `frontend` | Interface utilisateur |

