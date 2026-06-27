# FasoArtisan AI - Documentation

## Presentation

FasoArtisan AI est le module d'intelligence artificielle de la plateforme FasoArtisan. Il analyse les commentaires, resume les avis et permet la recherche vocale d'artisans.

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Next.js 16 App Router (TypeScript) |
| LLM | Llama 3.1 8B (via Groq) |
| Speech-to-Text | Whisper Large v3 (via Groq) |
| Client API | OpenAI SDK (compatible Groq) |
| Langage | 100% Francais |

> **Note**: Ce module est une application Next.js avec des route handlers, PAS un serveur Express. Les routes sont dans `AI/api/ai/` et re-exportees via `app/api/ai/` pour le routing Next.js.

## Fonctionnalites

### 1. Notation automatique (`POST /api/ai/analyze`)

L'IA analyse un commentaire et retourne :
- La note du commerce (1 a 5 etoiles)
- Le sentiment (positif, neutre, negatif)
- Les points forts et faibles
- Une justification

**Exemple :**
```json
// Entree
{ "commentaire": "Ce mecanicien est tres bon, il a repare ma moto en 2h" }

// Sortie
{
  "pertinent": true,
  "note": 5,
  "sentiment": "positif",
  "points_forts": ["qualite du travail", "rapidite"],
  "points_faibles": [],
  "raison": "Le mecanicien a repare la moto en 2 heures..."
}
```

### 2. Filtrage anti-spam

L'IA rejette automatiquement :
- Les commentaires vides ou trop courts
- Les commentaires hors sujet (publicite, liens)
- Les commentaires non pertinents

**Exemple :**
```json
{ "commentaire": "achetez mes produits sur www.spam.com" }
// Sortie : { "pertinent": false, "note": 0 }
```

### 3. Resume automatique des avis (`POST /api/ai/summarize`)

L'IA resume plusieurs commentaires en une phrase claire.

**Exemple :**
```json
// Entree
{ "commentaires": ["bon travail", "trop cher", "je recommande", "accueil sympa"] }

// Sortie
{
  "resume": "Le commerce a recu des commentaires positifs...",
  "points_forts": ["Travail de qualite", "Accueil sympathique"],
  "points_faibles": ["Prix eleve"]
}
```

### 4. Recherche vocale (`POST /api/ai/voice-search`)

Un habitant parle dans son micro, l'IA comprend ce qu'il cherche.

**Exemple :**
```json
// Entree : audio d un habitant disant "Je cherche un coiffeur a Ouara 2000"

// Sortie
{
  "texte": "Je cherche un coiffeur a Ouara 2000",
  "intention": "recherche",
  "categorie": "Coiffeur",
  "quartier": "Ouara 2000",
  "urgence": false
}
```

### 5. Transcription audio (`POST /api/ai/speech-to-text`)

Transcrit un fichier audio en texte.

**Exemple :**
```json
// Entree : audio

// Sortie
{ "text": "Je cherche un mecanicien pres du marche" }
```

## Architecture

```
AI/
├── api/ai/
│   ├── analyze/route.ts         # Notation automatique
│   ├── summarize/route.ts       # Resume des avis
│   ├── speech-to-text/route.ts  # Transcription audio
│   └── voice-search/route.ts    # Recherche vocale
└── lib/
    ├── ai-client.ts             # Client Groq
    ├── ai-prompts.ts            # Prompts LLM
    ├── ai-parser.ts             # Parse JSON robuste
    └── ai-schemas.ts            # Types TypeScript
```

## Comment ca marche

1. L'utilisateur envoie un commentaire (texte ou audio)
2. Si audio : Whisper transcrit en texte francais
3. LLM Llama analyse le texte
4. Le resultat est retourne en JSON
5. Le frontend affiche les etoiles, le sentiment, etc.

## Protection contre la manipulation

- Commentaire vide → rejeté
- Commentaire hors sujet → rejeté par le LLM
- Spam/publicite → rejeté
- Doublons (meme user + meme texte + meme jour) → a gerer cote backend

## Pour le jury

> "Notre module IA analyse automatiquement les commentaires et protege le systeme contre les faux avis. La recherche vocale permet aux habitants de trouver un artisan sans ecrire. Toute l'IA fonctionne en francais, langue officielle du Burkina Faso. Notre architecture est modulaire : l'ajout du moore et du dioula ne necessite qu'un changement du module de transcription."

## Tests

Voir `TESTS.md` pour la liste complete des tests et commandes.
