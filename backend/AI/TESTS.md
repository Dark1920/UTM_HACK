# Tests effectues - FasoArtisan AI

## Pipeline Analyse (`POST /api/ai/analyze`)

### 1. Commentaires standard

| Commentaire | Attendu | Resultat |
|---|---|---|
| Ce mecanicien est tres bon, il a repare ma moto en 2h | positif, 4.5-5 | positif, 5 |
| Trop cher et il a abime ma voiture, je ne recommande pas | negatif, 1-2 | negatif, 1 |
| c bon le gars il fait bien son boulot je recommande 100% | positif, 4-5 | positif, 5 |
| bon mecanicien prix correct travail bien fait accueil sympathique | positif, 4-5 | positif, 5 |

### 2. Cas limites - Pertinence

| Commentaire | Attendu | Resultat |
|---|---|---|
| achetez mes produits sur www.spam.com | non pertinent | non pertinent |
| bonjour | non pertinent | non pertinent |
| . (un point) | non pertinent | non pertinent |
| aaaaaaaaaaa | non pertinent | non pertinent |
| ok | non pertinent | non pertinent |

### 3. Langage SMS / Fautes d'orthographe

| Commentaire | Attendu | Resultat |
|---|---|---|
| c tro bon ce mecanisien il a reprrer ma moto vittement | positif, 4-5 | positif, 4.5 |
| trooooooop biennnn ce gars laaa, je recommande grave | positif, 4-5 | positif, 5 |

### 4. Melange francais/anglais

| Commentaire | Attendu | Resultat |
|---|---|---|
| this mecanicien is very good, il a fait un bon travail, fast delivery | positif, 4-5 | positif, 5 |

### 5. Commentaire long

| Commentaire | Attendu | Resultat |
|---|---|---|
| Ce mecanicien est vraiment tres bien... (150 mots) | positif, 5 | positif, 5 |

### 6. Sentiment mixte

| Commentaire | Attendu | Resultat |
|---|---|---|
| mais trop cher | negatif, 2-3 | negatif, 2 |

### 7. Emojis seuls

| Commentaire | Attendu | Resultat |
|---|---|---|
| (pouce en l'air) | positif, 5 | positif, 5 |
| (trois etoiles) | positif, 5 | positif, 5 |
| (pouce en bas) x3 | negatif, 1 | negatif, 1 |
| (coeur casse) x2 | negatif, 1 | negatif, 1 |

### 8. Emojis + texte

| Commentaire | Attendu | Resultat |
|---|---|---|
| bon mecanicien (pouce en l'air, feu, force) | positif, 5 | positif, 5 |
| (pouce en l'air) mais trop cher | negatif, 2 | negatif, 2 |
| (pouce en l'air, feu, force) le mec est trop fort | positif, 5 | positif, 5 |

### 9. Caracteres speciaux / Encodage

| Commentaire | Attendu | Resultat |
|---|---|---|
| c'est bien ce coiffeur, il coupe tres bien les cheveux (encodage Unicode) | positif, 4-5 | positif, 4 |

### 10. Note courte

| Commentaire | Attendu | Resultat |
|---|---|---|
| 5/5 | positif, 5 | positif, 5 |

---

## Pipeline Resume (`POST /api/ai/summarize`)

| Commentaires | Resultat |
|---|---|
| ["bon travail", "trop cher", "je recommande", "accueil sympa"] | Resume coherent avec points forts et faibles |

---

## Tests restants a effectuer

- [ ] Reponse mal formatee du LLM (parser JSON)
- [ ] Commentaire vide (chaine vide)
- [ ] Commentaire tres long (> 5000 caracteres)
- [ ] Commentaire en wolof pur
- [ ] Test de charge (plusieurs appels rapides)

---

## Commandes de test (PowerShell)

### Lancer le serveur

```bash
npm run dev    # backend demarre sur le port 3001
```

### Pipeline Analyse

```powershell
# Commentaire standard positif
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"Ce mecanicien est tres bon, il a repare ma moto en 2h"}'

# Commentaire standard negatif
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"Trop cher et il a abime ma voiture, je ne recommande pas"}'

# Spam / publicite
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"achetez mes produits sur www.spam.com"}'

# Trop court
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"bonjour"}'

# Un point
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"."}'

# Fautes d orthographe
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"c tro bon ce mecanisien il a reprrer ma moto vittement"}'

# Melange francais/anglais
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"this mecanicien is very good, il a fait un bon travail, fast delivery"}'

# Repetitions de lettres
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"trooooooop biennnn ce gars laaa, je recommande grave"}'

# Sentiment mixte
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"👍 mais trop cher"}'

# Emojis positifs seuls
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"🔥"}'

# Emojis negatifs seuls
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"👎👎👎"}'

# Coeur casse
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"💔💔"}'

# Etoiles
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"⭐⭐⭐⭐⭐"}'

# Note courte
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"5/5"}'

# Commentaire long
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"Ce mecanicien est vraiment tres bien, il a repare ma moto en 2h seulement, le prix etait correct, l accueil etait sympathique, je recommande vivement a tous mes amis, c est le meilleur mecanicien du quartier"}'

# Texte + emojis
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/analyze" -Method Post -ContentType "application/json" -Body '{"commentaire":"bon mecanicien 👍🔥💪"}'
```

### Pipeline Resume

```powershell
# Resume de commentaires
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/summarize" -Method Post -ContentType "application/json" -Body '{"commentaires":["bon travail","trop cher","je recommande","accueil sympa"]}'
```

### Pipeline Vocal

```powershell
# Speech-to-text (transcription audio)
curl.exe -X POST http://localhost:3001/api/ai/speech-to-text -F "audio=@D:\test_transcript.mpeg"

# Voice-search (recherche d artisan par la voix)
curl.exe -X POST http://localhost:3001/api/ai/voice-search -F "audio=@C:\Users\HP 2025\Music\test_vosea.m4a"
```

### Tests Voice-Search - Resultats

| Audio | Attendu | Resultat |
|---|---|---|
| "Je cherche un coiffeur a Ouara 2000" | intention: recherche, categorie: Coiffeur, quartier: Ouara 2000 | ✅ |
| Musique (paroles) | intention: incomprehensible ou transcription des paroles | ✅ |
| Audio vide | intention: incomprehensible | ✅ |
