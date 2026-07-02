# FasoArtisan - Frontend

Application client de la plateforme FasoArtisan. Annuaire intelligent des artisans du Burkina Faso avec IA, geolocalisation et recherche vocale.

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand |
| Formulaires | react-hook-form + Zod |
| Base de donnees | Supabase (PostgreSQL) |
| Cartes | Leaflet + react-leaflet |
| Icons | Lucide React |
| Dates | date-fns |
| Hors ligne | Dexie (IndexedDB) |
| IA | Routes backend via proxy (`/api/ai/*`) |
| Photos | Pexels API (cote serveur) |

## Dependances

Ce frontend depend du **backend** (`localhost:3001`) pour les fonctionnalites IA. Il communique via des rewrites Next.js qui proxyfient `/api/ai/*` vers le backend.

```
Frontend (3000)  ──proxy──>  Backend (3001)
     │                            │
     └──────── Supabase ──────────┘
```

## Demarrage

```bash
# Depuis la racine du monorepo
npm run dev:frontend    # port 3000

# Ou depuis ce dossier
npm run dev
```

Le backend doit tourner sur le port 3001 en parallele :

```bash
npm run dev:backend     # port 3001
```

## Variables d'environnement

Copier `.env.local.example` vers `.env.local` :

```bash
cp .env.local.example .env.local
```

| Variable | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique Supabase | `eyJ...` |
| `SUPABASE_URL` | URL Supabase (cote serveur) | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle service role Supabase | `eyJ...` |
| `AI_API_KEY` | Cle API Groq (pour le proxy) | `gsk_...` |
| `AI_BASE_URL` | URL API Groq | `https://api.groq.com/openai/v1` |
| `AI_MODEL` | Modele LLM | `llama-3.1-8b-instant` |
| `PEXELS_API_KEY` | Cle API Pexels (photos) | `xxxx` |
| `NEXT_PUBLIC_BACKEND_URL` | URL du backend | `http://localhost:3001` |
| `BACKEND_URL` | Alias backend compatible | `http://localhost:3001` |

## Structure

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/             # Auth (connexion, inscription, reset)
│   ├── (public)/           # Pages publiques (annuaire, commerce, urgence)
│   ├── admin/              # Panel administrateur
│   ├── dashboard/          # Dashboard artisan
│   └── api/                # Routes API cote serveur
│       ├── avis/           # CRUD avis (Supabase + IA)
│       └── photos/         # Proxy Pexels
├── components/             # Composants React
│   ├── ui/                 # Composants UI generiques
│   ├── layout/             # Header, footer, sidebar
│   ├── maps/               # Leaflet
│   ├── commerces/          # Fiches commerces
│   ├── commentaires/       # Avis
│   ├── admin/              # Admin panel
│   └── dashboard/          # Dashboard artisan
├── hooks/                  # Hooks React custom
├── services/               # Couche service (appels API/Supabase)
├── stores/                 # Etat Zustand
├── types/                  # Types TypeScript
├── lib/                    # Utilitaires (Supabase, Pexels, etc.)
├── utils/                  # Helpers (formatage, validation, etc.)
└── constants/              # Constantes (routes, categories, etc.)
```

## Services connectes

| Service | Methode | Status |
|---|---|---|
| Auth (login/logout/register) | Supabase Auth | Connecte |
| Commerces (CRUD) | Supabase `commerces` | Connecte |
| Categories | Supabase `categories` | Connecte |
| Avis (CRUD + analyse IA) | `/api/avis` → Supabase + backend | Connecte |
| Analyse de sentiment | `/api/ai/analyze` → backend → Groq | Connecte |
| Resume de commentaires | `/api/ai/summarize` → backend → Groq | Connecte |
| Detection de spam | `/api/ai/analyze` → backend → Groq | Connecte |
| Photos | `/api/photos` → Pexels | Connecte |
| Recherche vocale | `voiceSearchService` → `/api/ai/voice-search` → backend → Whisper + LLM | Connecte |
| Transcription audio | `voiceSearchService.transcribe()` → `/api/ai/speech-to-text` → backend → Whisper | Connecte |
| Geolocalisation | `geolocationService` → browser Geolocation API | Connecte |
| Admin CRUD | `adminService` | Mock (pas de backend admin) |
| Statistiques | `statistiquesService` | Mock (pas de backend analytics) |
| Upload | `uploadService` | Mock (pas de backend upload) |
| Favoris | `favorisService` | Local (localStorage) |
| Admin CRUD | Mock | Non connecte |
| Statistiques | Mock | Non connecte |
| Upload fichiers | Mock | Non connecte |
| Favoris | localStorage | Local uniquement |

## Routes principales

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/annuaire` | Annuaire avec filtres + carte |
| `/commerce/[id]` | Fiche detaillee d'un commerce |
| `/urgence` | Mode urgence (geolocalisation) |
| `/favoris` | Favoris (localStorage) |
| `/connexion` | Connexion |
| `/inscription` | Inscription |
| `/dashboard` | Dashboard artisan |
| `/dashboard/commerces` | Gestion des commerces |
| `/admin` | Panel administrateur |

## Architecture des appels API

```
Client (browser)
  │
  ├── commerceService.getAll()
  │     └── supabase.from('commerces').select(...)
  │
  ├── commentaireService.getByCommerceId()
  │     └── fetch('/api/avis?commerceId=...')
  │           ├── Supabase CRUD
  │           └── fetch('http://localhost:3001/api/ai/analyze')
  │
  ├── groqService.analyseSentiment()
  │     └── fetch('/api/ai/analyze')
  │           └── [proxy rewrites] → backend:3001
  │
  ├── voiceSearchService.search(audio)
  │     └── fetch('/api/ai/voice-search', FormData)
  │           └── [proxy rewrites] → backend:3001 → Whisper + LLM
  │
  ├── voiceSearchService.transcribe(audio)
  │     └── fetch('/api/ai/speech-to-text', FormData)
  │           └── [proxy rewrites] → backend:3001 → Whisper
  │
  ├── geolocationService.getCurrentPosition()
  │     └── navigator.geolocation.getCurrentPosition()
  │
  └── usePexelsPhotos()
        └── fetch('/api/photos?query=...')
              └── Pexels API
```

## Hooks disponibles

| Hook | Description |
|---|---|
| `useAuth` | Etat d'authentification (login/logout/user) |
| `useCommerce` | Donnees commerces (load/select/create/update/delete) |
| `useComments` | Avis (load/add/delete) |
| `useSearch` | Recherche avec filtres |
| `useVoiceSearch` | Enregistrement micro + recherche vocale |
| `useSpeechToText` | Enregistrement micro + transcription |
| `useGeolocation` | Position GPS + watch |
| `useFavorites` | Favoris (localStorage) |
| `usePexelsPhotos` | Photos Pexels |
| `useMap` | Integration Leaflet |
| `usePagination` | Pagination |
| `useDebounce` | Debounce |
| `useOffline` | Detection hors ligne |

## Tests

```bash
npm run lint      # ESLint
npm run build     # Build de production
```

## Deploiement

Le frontend peut etre deploie sur Vercel, Netlify ou tout autre hebergeur Next.js. Les variables d'environnement doivent etre configurees dans l'interface de l'hebergeur.
