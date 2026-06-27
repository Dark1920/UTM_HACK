export function extractJson(text: string): unknown {
  const cleaned = text.trim()

  // 1) JSON brut
  try {
    return JSON.parse(cleaned)
  } catch {
    // continue
  }

  // 2) Bloc code ```json ... ``` (prioritaire sur la recherche de braces)
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim())
    } catch {
      // continue
    }
  }

  // 3) Recherche du premier objet { ... } (heuristique)
  const braceMatch = cleaned.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch {
      // continue
    }
  }

  throw new Error(`Impossible d'extraire un JSON valide : ${cleaned.slice(0, 500)}`)
}

