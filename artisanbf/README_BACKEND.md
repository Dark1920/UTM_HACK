# ArtisanBF - Backend Documentation

## 📋 Vue d'ensemble

ArtisanBF est une plateforme web de mise en relation entre citoyens et artisans/petits commerçants au Burkina Faso, avec recherche géolocalisée, cartographie interactive, et fonctionnalités IA.

Ce document couvre **100% du backend** implémenté. Le frontend (design, composants visuels) et l'IA seront développés séparément.

---

## ✅ Ce qui a été codé (Backend Complet)

### 1. **Base de données (Supabase PostgreSQL + PostGIS)**

#### Migrations SQL (8 fichiers)
- `0001_init_extensions.sql` - Activation PostGIS et UUID
- `0002_tables_utilisateurs.sql` - Table utilisateurs avec trigger auto-création
- `0003_tables_commerces.sql` - Table commerces avec géolocalisation (GIST index)
- `0004_tables_avis.sql` - Table avis avec champs IA (sentiment, spam, résumé)
- `0005_tables_categories_signalements.sql` - Catégories, signalements, statistiques
- `0006_rls_policies.sql` - **Row Level Security complet** sur TOUTES les tables
- `0007_storage_policies.sql` - Policies Storage (bucket photos-commerces)
- `0008_fonctions_geo.sql` - Fonctions SQL PostGIS (proximité, recherche full-text)

#### Tables créées
1. **utilisateurs** - Profils liés à auth.users (role: citoyen/artisan/admin)
2. **commerces** - Businesses avec localisation GEOGRAPHY(Point, 4326)
3. **photos_commerces** - Images via Supabase Storage
4. **avis** - Reviews avec champs IA (nullable)
5. **categories** - Catégories de commerces
6. **signalements** - Reports modération
7. **statistiques_commerces** - Tracking vues/appels/clics WhatsApp

#### Sécurité
- ✅ RLS activé sur **TOUTES** les tables
- ✅ Policies filtrées par `auth.uid()` et rôle
- ✅ Accès public uniquement aux commerces `statut='publie'`
- ✅ Admin a accès total via vérification de rôle
- ✅ Storage policies forcent le chemin `{user_id}/{commerce_id}/`

---

### 2. **Validation (Zod)**

Schémas complets pour:
- `auth.schema.ts` - Inscription (email, password fort, nom, role), connexion, reset password
- `commerce.schema.ts` - Création/mise à jour/suppression de commerce avec géoloc
- `avis.schema.ts` - Création/mise à jour/suppression d'avis (note 1-5, commentaire)

**100% des entrées utilisateur sont validées avant écriture DB.**

---

### 3. **Server Actions (6 fichiers)**

#### `auth.actions.ts`
- `inscription()` - Inscription avec rate limiting (3/heure)
- `connexion()` - Login avec redirect
- `deconnexion()` - Logout
- `resetPassword()` - Email de réinitialisation
- `getCurrentUser()` - Récupère user + profil
- `checkRole()` - Vérification de rôle

#### `commerce.actions.ts`
- `createCommerce()` - Création avec géolocalisation PostGIS
- `updateCommerce()` - Mise à jour (vérifie propriété)
- `deleteCommerce()` - Suppression
- `getMyCommerces()` - Liste des commerces de l'utilisateur

#### `avis.actions.ts`
- `createAvis()` - Création avec rate limiting (5/minute) + **stub IA**
- `updateAvis()` - Mise à jour
- `deleteAvis()` - Suppression
- `recalculerNoteCommerce()` - Recalcule note moyenne automatiquement

#### `profil.actions.ts`
- `updateProfil()` - Mise à jour nom/téléphone
- `getProfil()` - Récupération du profil

#### `dashboard.actions.ts`
- `trackVueCommerce()` - Incrémente compteur vues
- `trackAppelCommerce()` - Incrémente compteur appels
- `trackWhatsAppClick()` - Incrémente compteur clics WhatsApp
- `getCommerceStats()` - Récupère statistiques sur N jours

#### `admin.actions.ts`
- `updateUserRole()` - Changer rôle utilisateur
- `modererSignalement()` - Modérer un signalement
- `adminDeleteCommerce()` - Supprimer commerce (admin)
- `markAsSpam()` - Marquer avis comme spam
- `getAllSignalements()` - Liste tous les signalements

---

### 4. **API Route Handlers (publiques, sans auth)**

- `GET /api/recherche` - Recherche géolocalisée (texte OU proximité)
  - Rate limiting: 30 requêtes/minute par IP
  - Utilise fonctions SQL PostGIS (`search_commerces`, `get_commerces_proches`)
  
- `GET /api/categories` - Liste toutes les catégories

---

### 5. **Middleware Next.js**

Protection automatique des routes:
- `/dashboard/*` → Requiert authentification
- `/admin/*` → Requiert rôle `admin`
- `/connexion`, `/inscription` → Redirige vers `/dashboard` si déjà connecté

---

### 6. **Rate Limiting (Upstash Redis)**

- `avisRateLimiter` - 5 avis/minute par user_id
- `inscriptionRateLimiter` - 3 inscriptions/heure par IP
- `rechercheRateLimiter` - 30 recherches/minute par IP

**Fail-open**: Si Redis est down, les requêtes passent (évite les faux positifs).

---

### 7. **Sécurité**

✅ **CSP Headers** dans `next.config.mjs`:
- Content-Security-Policy strict
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera/microphone désactivés, géoloc autorisée

✅ **Variables d'environnement**:
- Aucune clé serveur avec préfixe `NEXT_PUBLIC_`
- Supabase anon key uniquement côté client
- Groq API key réservée équipe IA (commentée dans `.env.example`)

---

### 8. **CI/CD (GitHub Actions)**

Workflow `.github/workflows/ci.yml`:
- ESLint sur chaque push/PR
- TypeScript type-check (`tsc --noEmit`)
- Build check avec variables d'environnement
- Test sur Node 18.x et 20.x

---

## 🔧 Stubs pour l'équipe IA

### **TODO[IA-TEAM]** laissés dans le code:

1. **`src/types/ia.ts`**
   - Interface `AnalyseIAResult` définie
   - Interface `AnalyseAvisInput` définie
   - Contrat d'entrée/sortie pour l'Edge Function

2. **`src/actions/avis.actions.ts` (ligne ~76)**
   ```typescript
   // TODO[IA-TEAM]: Appel à l'Edge Function Supabase "analyze-review"
   // Entrée attendue : { commentaire: string, commerceId: string }
   // Sortie attendue : { sentiment, score, resume, isSpam }
   const analyseIA: AnalyseIAResult | null = null; // placeholder
   ```

3. **`supabase/functions/analyze-review/index.ts`**
   - Fichier NON créé (réservé équipe IA)
   - Doit être une Edge Function Supabase (Deno)
   - Utilisera `groq-sdk` pour l'analyse

4. **`.env.example`**
   - `GROQ_API_KEY` déclarée mais commentée
   - À décommenter quand l'équipe IA implémente l'Edge Function

---

## 🎨 Stubs pour l'équipe Frontend

### **TODO[FRONTEND-TEAM]** laissés dans le code:

Toutes les pages `page.tsx` et `layout.tsx` créées sont des **squelettes minimalistes**:
- Importent ce qui est nécessaire pour compiler
- Affichent un placeholder simple
- **PAS** de design Tailwind avancé
- **PAS** de composants visuels élaborés

**Exemple:**
```tsx
export default function RecherchePage() {
  return <div>TODO[FRONTEND-TEAM]: Page de recherche par carte</div>;
}
```

**Pages créées (squelettes):**
- `(public)/page.tsx` - Accueil
- `(public)/recherche/page.tsx` - Recherche
- `(public)/carte/page.tsx` - Carte interactive
- `(public)/urgence/page.tsx` - Mode urgence
- `(public)/commerces/[id]/page.tsx` - Détail commerce
- `(auth)/connexion/page.tsx` - Login
- `(auth)/inscription/page.tsx` - Registration
- `(auth)/reinitialisation/page.tsx` - Reset password
- `(dashboard)/layout.tsx` - Layout protégé
- `(dashboard)/dashboard/page.tsx` - Stats artisan
- `(dashboard)/mes-commerces/page.tsx` - Liste commerces
- `(dashboard)/profil/page.tsx` - Profil utilisateur
- `(admin)/layout.tsx` - Layout admin
- `(admin)/admin/utilisateurs/page.tsx` - Gestion users
- `(admin)/admin/commerces/page.tsx` - Gestion commerces
- `(admin)/admin/avis/page.tsx` - Modération avis
- `(admin)/admin/categories/page.tsx` - Gestion catégories
- `(admin)/admin/signalements/page.tsx` - Gestion signalements

---

## 🚀 Comment lancer le projet en local

### Prérequis
- Node.js 18+ ou 20+
- npm ou yarn
- Compte Supabase (gratuit)
- Compte Upstash Redis (gratuit)

### 1. Cloner et installer

```bash
cd artisanbf
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplir avec vos valeurs:
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anon (pas service_role!)
- `UPSTASH_REDIS_REST_URL` - URL Redis Upstash
- `UPSTASH_REDIS_REST_TOKEN` - Token Redis
- `NEXT_PUBLIC_SITE_URL` - `http://localhost:3000`

### 3. Appliquer les migrations SQL

**Option A: Via Supabase CLI**
```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

**Option B: Via Dashboard Supabase**
1. Aller dans SQL Editor
2. Copier-coller chaque fichier `supabase/migrations/*.sql` dans l'ordre (0001 → 0008)
3. Exécuter

### 4. Générer les types TypeScript (optionnel)

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir `http://localhost:3000`

### 6. Créer un admin manuellement (premier utilisateur)

```sql
-- Dans SQL Editor Supabase
UPDATE utilisateurs 
SET role = 'admin' 
WHERE email = 'votre-email@admin.com';
```

---

## 📦 Déploiement sur Vercel

### 1. Push sur GitHub

```bash
git add .
git commit -m "Initial backend commit"
git push origin main
```

### 2. Importer sur Vercel

1. Aller sur https://vercel.com
2. Importer le repository GitHub
3. Ajouter les variables d'environnement dans Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` (URL de production)

### 3. Déployer

Vercel déploie automatiquement à chaque push sur `main`.

---

## 📁 Structure du projet

```
artisanbf/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Routes publiques
│   │   ├── (auth)/             # Authentification
│   │   ├── (dashboard)/        # Dashboard artisan
│   │   ├── (admin)/            # Back-office admin
│   │   └── api/                # Route Handlers
│   ├── actions/                # Server Actions (6 fichiers)
│   ├── lib/
│   │   ├── supabase/           # Clients Supabase (browser, server, middleware)
│   │   ├── validations/        # Schémas Zod (3 fichiers)
│   │   ├── geo/                # Helpers PostGIS
│   │   ├── ratelimit/          # Config Upstash Redis
│   │   └── utils.ts            # Utilitaires partagés
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Protection des routes
├── supabase/
│   ├── migrations/             # 8 migrations SQL
│   └── functions/              # Edge Functions (stub IA)
├── .github/workflows/
│   └── ci.yml                  # CI/CD
├── .env.example                # Variables d'environnement
├── next.config.mjs             # Config Next.js + CSP headers
├── package.json                # Dépendances
└── README_BACKEND.md           # Ce fichier
```

---

## 🔐 Sécurité - Checklist

- [x] RLS activé sur toutes les tables
- [x] Middleware protège /dashboard et /admin
- [x] Zod validation sur 100% des entrées
- [x] CSP headers configurés
- [x] Rate limiting sur actions critiques
- [x] Pas de clé serveur dans NEXT_PUBLIC_*
- [x] Storage policies strictes
- [x] Password fort requis (8+ chars, maj, min, numéro)

---

## 📝 Notes importantes

### Routes Groups Next.js
Les dossiers entre parenthèses `(public)`, `(auth)`, `(dashboard)`, `(admin)` sont des **Route Groups**. Ils n'apparaissent **PAS** dans l'URL mais permettent d'organiser le code et d'avoir des layouts différents.

### PostGIS
La géolocalisation utilise le type `GEOGRAPHY(Point, 4326)` de PostGIS. Les requêtes de proximité utilisent `ST_DWithin` pour des performances optimales avec index GIST.

### Supabase SSR
Le projet utilise `@supabase/ssr` pour une gestion correcte des sessions côté serveur (Server Components, Server Actions, Middleware).

---

## 🆘 Support

Pour toute question sur le backend:
- Vérifier les logs dans la console Next.js
- Vérifier les policies RLS dans Supabase Dashboard
- Tester les API routes avec Postman/Insomnia

---

## 📄 License

Projet développé pour UTM HACK 2026.
