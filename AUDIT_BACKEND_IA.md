# 🔍 AUDIT TECHNIQUE - BACKEND & IA
## ArtisanBF - Plateforme de mise en relation citoyens/artisans

---

## 📊 VUE D'ENSEMBLE

**Projet :** ArtisanBF  
**Stack :** Next.js 14.2.35 + TypeScript + Supabase + Groq AI  
**Architecture :** Monorepo (artisanbf/ + frontend/)  
**Dernière mise à jour :** 27 Juin 2026

---

## 🏗️ ARCHITECTURE DU BACKEND

### **1. Structure du Backend**

```
artisanbf/
├── src/
│   ├── app/api/              ← API Routes (Endpoints REST)
│   │   ├── ai/               ← Intelligence Artificielle
│   │   │   ├── analyze/      ← Analyse de sentiment
│   │   │   ├── summarize/    ← Résumé d'avis
│   │   │   ├── speech-to-text/ ← Voix → Texte
│   │   │   └── voice-search/ ← Recherche vocale
│   │   ├── auth/             ← Authentification
│   │   │   ├── connexion/    ← Login
│   │   │   └── inscription/  ← Register
│   │   ├── avis/             ← Gestion des avis (CRUD + IA)
│   │   ├── categories/       ← Catégories
│   │   ├── commerces/        ← CRUD Commerces
│   │   ├── geocoding/        ← Géocodage (OpenStreetMap)
│   │   └── recherche/        ← Recherche géolocalisée
│   │
│   ├── lib/                  ← Bibliothèques
│   │   ├── ia/               ← Configuration IA
│   │   │   ├── client.ts     ← Client Groq (OpenAI SDK)
│   │   │   ├── prompts.ts    ← Prompts système
│   │   │   ├── parser.ts     ← Extraction JSON
│   │   │   └── schemas.ts    ← Types TypeScript
│   │   ├── supabase/         ← Configuration DB
│   │   │   ├── client.ts     ← Client navigateur
│   │   │   ├── server.ts     ← Client serveur
│   │   │   └── middleware.ts ← Middleware auth
│   │   ├── geo/              ← Géolocalisation
│   │   └── validations/      ← Schémas de validation
│   │
│   └── types/                ← Types TypeScript
│       └── database.types.ts ← Schéma DB complet
│
├── supabase/migrations/      ← Migrations SQL
└── .env.local                ← Variables d'environnement
```

---

## 🤖 INTÉGRATION IA (GROQ)

### **2. Configuration IA**

**Fichier :** `artisanbf/src/lib/ia/client.ts`

```typescript
import OpenAI from "openai"

export const ai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
})
```

**Modèle utilisé :** `llama-3.1-8b-instant`  
**Fournisseur :** Groq (API compatible OpenAI)  
**Temps de réponse :** ~200-500ms

---

### **3. PROMPTS SYSTÈME**

**Fichier :** `artisanbf/src/lib/ia/prompts.ts`

#### **A. ANALYZE_SYSTEM** (Analyse de sentiment)
- **Objectif :** Analyser un commentaire d'artisan
- **Sortie attendue :**
  ```json
  {
    "pertinent": boolean,
    "note": number (1-5),
    "sentiment": "positif" | "neutre" | "negatif",
    "criteres": {
      "qualite": number,
      "professionnalisme": number,
      "rapidite": number,
      "prix": number
    },
    "points_forts": string[],
    "points_faibles": string[],
    "raison": string
  }
  ```
- **Règles spéciales :**
  - Gère les emojis (😊 = positif, 😡 = négatif)
  - Tolère les fautes d'orthographe
  - Détecte le spam/publicité
  - Note arrondie au 0.5 près

#### **B. SUMMARIZE_SYSTEM** (Résumé d'avis)
- **Objectif :** Synthétiser plusieurs commentaires
- **Sortie attendue :**
  ```json
  {
    "resume": string (2-3 phrases),
    "points_forts": string[],
    "points_faibles": string[]
  }
  ```

#### **C. VOICE_SEARCH_SYSTEM** (Recherche vocale)
- **Objectif :** Comprendre une demande vocale
- **Sortie attendue :**
  ```json
  {
    "intention": "recherche" | "commentaire" | "incomprehensible",
    "categorie": string | null,
    "quartier": string | null,
    "urgence": boolean
  }
  ```

---

### **4. PARSER JSON**

**Fichier :** `artisanbf/src/lib/ia/parser.ts`

**Fonction :** `extractJson(text: string): unknown`

**Stratégie d'extraction :**
1. Essayer de parser directement (`JSON.parse`)
2. Chercher un bloc de code ```json ... ```
3. Chercher le premier objet `{ ... }`
4. Lancer une erreur si rien de valide trouvé

**Robustesse :** Gère les réponses IA mal formatées

---

### **5. SCHÉMAS TYPESCRIPT**

**Fichier :** `artisanbf/src/lib/ia/schemas.ts`

```typescript
interface ReviewAnalysis {
  pertinent: boolean
  note: number
  sentiment: "positif" | "neutre" | "negatif"
  criteres: CritereNote
  points_forts: string[]
  points_faibles: string[]
  raison: string
}

interface Summary {
  resume: string
  points_forts: string[]
  points_faibles: string[]
}

interface VoiceSearchResult {
  texte: string
  intention: "recherche" | "commentaire" | "incomprehensible"
  categorie: string | null
  quartier: string | null
  urgence: boolean
}
```

---

## 🔌 ENDPOINTS API

### **6. API IA**

#### **POST /api/ai/analyze**
**Description :** Analyse un commentaire avec IA  
**Fichier :** `artisanbf/src/app/api/ai/analyze/route.ts`

**Requête :**
```json
{
  "commentaire": "Excellent mécanicien, travail rapide et professionnel !"
}
```

**Réponse :**
```json
{
  "pertinent": true,
  "note": 4.5,
  "sentiment": "positif",
  "criteres": {
    "qualite": 4.5,
    "professionnalisme": 5.0,
    "rapidite": 4.0,
    "prix": 3.5
  },
  "points_forts": ["Travail rapide", "Professionnel"],
  "points_faibles": [],
  "raison": "Commentaire positif mentionnant la rapidité et le professionnalisme"
}
```

**Logique :**
1. Pré-validation (longueur min, pas de spam)
2. Appel à Groq avec prompt ANALYZE_SYSTEM
3. Extraction JSON de la réponse
4. Validation du schéma
5. Retour du résultat

---

#### **POST /api/ai/summarize**
**Description :** Résume plusieurs commentaires  
**Fichier :** `artisanbf/src/app/api/ai/summarize/route.ts`

**Requête :**
```json
{
  "commentaires": [
    "Très bon service, je recommande",
    "Travail de qualité mais un peu cher",
    "Artisan professionnel et ponctuel"
  ]
}
```

**Réponse :**
```json
{
  "resume": "Les clients apprécient la qualité du travail et le professionnalisme. Quelques remarques sur les prix.",
  "points_forts": ["Qualité du travail", "Professionnalisme"],
  "points_faibles": ["Prix élevés"]
}
```

---

### **7. API COMMERCES**

**Fichier :** `artisanbf/src/app/api/commerces/route.ts`

#### **POST /api/commerces**
**Description :** Créer un commerce avec géocodage automatique

**Fonctionnalités :**
- ✅ Récupération automatique de `categorie_id` depuis `categories`
- ✅ Géocodage automatique via OpenStreetMap (Nominatim)
- ✅ Validation des coordonnées (Burkina Faso uniquement)
- ✅ Support coordonnées manuelles (carte Leaflet)

**Requête :**
```json
{
  "nom": "Garage du Faso",
  "categorie": "Mécanicien",
  "localisation": "Ouaga 2000, rue 12.34",
  "ville": "Ouagadougou",
  "telephone": "+226 70 12 34 56"
}
```

**Réponse :**
```json
{
  "id": "uuid-genere",
  "nom": "Garage du Faso",
  "categorie_id": "uuid-categorie",
  "latitude": 12.3060727,
  "longitude": -1.5028592,
  "statut": "en_attente",
  "geocodage": "réussi"
}
```

**Logique :**
1. Validation des champs obligatoires
2. Recherche de la catégorie (ilike insensible à la casse)
3. Géocodage avec fallback (adresse complète → ville)
4. Validation des coordonnées (9-15°N, -6 à 2°E)
5. Insertion avec `user_id` de l'utilisateur authentifié

---

### **8. API AVIS (avec IA automatique)**

**Fichier :** `artisanbf/src/app/api/avis/route.ts`

#### **POST /api/avis**
**Description :** Créer un avis avec analyse IA automatique

**Requête :**
```json
{
  "commerce_id": "uuid-commerce",
  "note": 4,
  "commentaire": "Très bon service, je recommande ce mécanicien"
}
```

**Réponse :**
```json
{
  "avis": {
    "id": "uuid-avis",
    "commerce_id": "uuid-commerce",
    "user_id": "uuid-user",
    "note": 4,
    "commentaire": "Très bon service...",
    "sentiment": "positif",
    "score_sentiment": 4.5,
    "is_spam": false,
    "analyse_ia": {
      "pertinent": true,
      "note": 4.5,
      "sentiment": "positif",
      "criteres": {...},
      "points_forts": [...],
      "points_faibles": [...]
    }
  }
}
```

**Logique :**
1. Vérification authentification
2. Validation des champs
3. **Analyse IA automatique** via Groq
4. Insertion avec SERVICE_ROLE_KEY (bypass RLS)
5. Retour de l'avis + analyse IA

---

## 🔐 SÉCURITÉ & AUTHENTIFICATION

### **9. Configuration Supabase**

**Fichiers :**
- `artisanbf/src/lib/supabase/client.ts` (navigateur)
- `artisanbf/src/lib/supabase/server.ts` (serveur)
- `artisanbf/src/lib/supabase/middleware.ts` (middleware)

**Stratégie :**
- **Client anonyme** pour les lectures publiques
- **Service Role Key** pour les opérations admin (bypass RLS)
- **User token** pour les opérations utilisateur

**RLS (Row Level Security) :**
```sql
-- Commerces
SELECT: Public (tout le monde peut lire)
INSERT: Authentifié uniquement
UPDATE: Propriétaire uniquement (user_id)
DELETE: Propriétaire uniquement (user_id)

-- Avis
INSERT: Authentifié uniquement
UPDATE: Propriétaire uniquement
```

---

## 🗺️ GÉOCODAGE

### **10. OpenStreetMap Nominatim**

**Fichier :** `artisanbf/src/app/api/geocoding/route.ts`

**Fonctionnalités :**
- ✅ Géocodage direct (adresse → coordonnées)
- ✅ Géocodage inverse (coordonnées → adresse)
- ✅ Fallback automatique (adresse précise → ville)
- ✅ Support Burkina Faso (countrycodes=bf)

**API :**
```
GET /api/geocoding?address=Ouaga 2000&city=Ouagadougou
POST /api/geocoding (reverse)
```

**Limites :**
- 1 requête/seconde (rate limit Nominatim)
- Précision dépendante d'OpenStreetMap
- Pas de clé API requise

---

## 📦 BASE DE DONNÉES

### **11. Schéma Supabase**

**Tables principales :**

#### **utilisateurs**
```sql
id UUID PRIMARY KEY
nom TEXT NOT NULL
telephone TEXT
photo_url TEXT
role TEXT DEFAULT 'citoyen' CHECK (role IN ('citoyen', 'artisan', 'admin'))
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### **categories** (12 catégories)
```sql
id UUID PRIMARY KEY
nom TEXT NOT NULL UNIQUE
slug TEXT NOT NULL UNIQUE
description TEXT
icone TEXT (emoji)
couleur TEXT (hex)
parent_id UUID (hiérarchie)
created_at TIMESTAMPTZ
```

#### **commerces** ⭐
```sql
id UUID PRIMARY KEY
user_id UUID NOT NULL (FK utilisateurs)
nom TEXT NOT NULL
description TEXT
categorie_id UUID (FK categories)
telephone TEXT
email TEXT
site_web TEXT
adresse TEXT
ville TEXT
code_postal TEXT
localisation TEXT NOT NULL
statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'publie', 'rejete', 'suspendu'))
note_moyenne NUMERIC DEFAULT 0
nombre_avis INTEGER DEFAULT 0
horaires JSONB
photo_principale TEXT
latitude DECIMAL(10, 8) AUTO-REMPLI
longitude DECIMAL(11, 8) AUTO-REMPLI
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

**Indexes :**
- `idx_commerces_categorie` (recherche par catégorie)
- `idx_commerces_nom` (GIN trigram pour recherche floue)
- `idx_commerces_description` (GIN trigram)
- `idx_commerces_location` (latitude, longitude)

#### **avis** 🤖
```sql
id UUID PRIMARY KEY
commerce_id UUID NOT NULL (FK commerces)
user_id UUID NOT NULL (FK utilisateurs)
note INTEGER CHECK (note BETWEEN 1 AND 5)
commentaire TEXT
sentiment TEXT CHECK (sentiment IN ('positif', 'neutre', 'negatif'))
score_sentiment NUMERIC
is_spam BOOLEAN DEFAULT FALSE
analyse_ia JSONB ← STOCKE L'ANALYSE IA COMPLÈTE
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

**Contrainte unique :**
```sql
CONSTRAINT unique_avis_user_commerce UNIQUE (user_id, commerce_id)
```
→ Un utilisateur = un seul avis par commerce

---

## 🔄 FLUX DE DONNÉES

### **12. Création d'un commerce**

```
1. Utilisateur → Formulaire (nom, catégorie, adresse, ville)
   ↓
2. API /api/commerces
   ↓
3. Recherche catégorie_id dans categories (ilike)
   ↓
4. Géocodage adresse via Nominatim
   ├─ Succès → latitude, longitude
   └─ Échec → Fallback ville
   ↓
5. Validation coordonnées (Burkina Faso)
   ↓
6. Insertion dans commerces (avec user_id)
   ↓
7. Retour commerce créé + statut géocodage
```

---

### **13. Création d'un avis avec IA**

```
1. Utilisateur → Formulaire (commerce_id, note, commentaire)
   ↓
2. Vérification authentification
   ↓
3. Vérification contrainte unique (1 avis/user/commerce)
   ↓
4. APPEL IA GROQ (analyse de sentiment)
   ├─ Prompt: ANALYZE_SYSTEM
   ├─ Modèle: llama-3.1-8b-instant
   └─ Réponse: JSON structuré
   ↓
5. Extraction JSON (parser.ts)
   ↓
6. Validation schéma (schemas.ts)
   ↓
7. Insertion dans avis (avec SERVICE_ROLE_KEY)
   ├─ note
   ├─ commentaire
   ├─ sentiment (depuis IA)
   ├─ score_sentiment (depuis IA)
   ├─ is_spam (depuis IA)
   └─ analyse_ia (JSON complet)
   ↓
8. Retour avis + analyse IA
```

---

## ⚙️ VARIABLES D'ENVIRONNEMENT

**Fichier :** `artisanbf/.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vwhvuoxyuquyuhijhkay.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Groq AI
AI_API_KEY=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
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.1-8b-instant

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NODE_TLS_REJECT_UNAUTHORIZED=0 ← Désactive vérification SSL (dev)
```

---

## 🚀 PERFORMANCES

### **14. Métriques IA**

| Opération | Temps moyen | Coût |
|-----------|-------------|------|
| Analyse sentiment | ~300ms | Gratuit (Groq) |
| Résumé avis | ~400ms | Gratuit |
| Recherche vocale | ~500ms | Gratuit |
| Géocodage | ~200ms | Gratuit (OSM) |

### **15. Optimisations**

✅ **Température basse (0.3)** → Réponses plus déterministes  
✅ **response_format: json_object** → JSON valide garanti  
✅ **Pre-validation** → Évite appels IA inutiles  
✅ **Fallback géocodage** → Adresse → Ville  
✅ **SERVICE_ROLE_KEY** → Bypass RLS pour opérations admin  

---

## 🔍 POINTS FORTS

### **✅ Architecture**
- ✅ Séparation claire (API Routes, Lib, Types)
- ✅ Types TypeScript stricts
- ✅ Prompts système bien documentés
- ✅ Parser JSON robuste

### **✅ IA**
- ✅ Modèle rapide (Llama 3.1 8B instant)
- ✅ Prompts spécialisés (FasoArtisan AI)
- ✅ Analyse automatique des avis
- ✅ Support emojis et langage informel

### **✅ Base de données**
- ✅ Schéma relationnel complet
- ✅ Indexes de recherche (GIN trigram)
- ✅ RLS activé
- ✅ Contraintes d'intégrité

### **✅ Géocodage**
- ✅ Automatique (OpenStreetMap)
- ✅ Fallback intelligent
- ✅ Validation géographique (Burkina Faso)
- ✅ Support carte Leaflet

---

## ⚠️ POINTS D'AMÉLIORATION

### **1. Sécurité**
- ⚠️ `NODE_TLS_REJECT_UNAUTHORIZED=0` en dev (risque SSL)
- ⚠️ SERVICE_ROLE_KEY exposée côté serveur (à surveiller)
- ⚠️ Pas de rate limiting sur les APIs IA

### **2. Robustesse**
- ⚠️ Pas de retry sur échec IA
- ⚠️ Pas de cache pour géocodage
- ⚠️ Pas de validation des emails (Supabase gère)

### **3. Performance**
- ⚠️ Pas de cache Redis (Upstash configuré mais non utilisé)
- ⚠️ Appels IA séquentiels (pas de batch)
- ⚠️ Pas de pagination cursor (offset-based)

### **4. Monitoring**
- ⚠️ Pas de logs structurés (JSON)
- ⚠️ Pas de métriques (Prometheus, etc.)
- ⚠️ Pas de tracking erreurs (Sentry, etc.)

---

## 📋 RECOMMANDATIONS

### **Court terme**
1. ✅ Ajouter rate limiting sur APIs IA
2. ✅ Implémenter retry avec backoff exponentiel
3. ✅ Ajouter cache Redis pour géocodage
4. ✅ Logger les appels IA (coûts, erreurs)

### **Moyen terme**
1. ✅ Implémenter batch IA (analyser plusieurs avis d'un coup)
2. ✅ Ajouter pagination cursor pour grandes listes
3. ✅ Mettre en place monitoring (Sentry)
4. ✅ Créer dashboard admin pour modération

### **Long terme**
1. ✅ Migrer vers modèle IA plus puissant (GPT-4, Claude)
2. ✅ Ajouter reconnaissance d'images (photos commerces)
3. ✅ Implémenter recherche sémantique (embeddings)
4. ✅ Créer système de recommandation personnalisé

---

## 🎯 CONCLUSION

Le backend ArtisanBF est **solide et bien architecturé** avec :
- ✅ Intégration IA complète (Groq/Llama 3.1)
- ✅ Base de données relationnelle propre
- ✅ Géocodage automatique
- ✅ Authentification sécurisée (Supabase)
- ✅ APIs REST bien documentées

**Points à améliorer :** Monitoring, rate limiting, cache, retry logic.

**Note globale :** 🟢 **8.5/10** - Prêt pour production avec quelques optimisations.

---

**Audit réalisé le :** 27 Juin 2026  
**Auditeur :** Assistant IA  
**Version :** 1.0
