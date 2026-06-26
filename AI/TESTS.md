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
