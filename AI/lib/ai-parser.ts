export function extractJson(text: string): unknown {
  const cleaned = text.trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    // continue
  }

  const braceMatch = cleaned.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch {
      // continue
    }
  }

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim())
    } catch {
      // continue
    }
  }

  throw new Error(`Impossible d'extraire un JSON valide : ${cleaned.slice(0, 500)}`)
}
