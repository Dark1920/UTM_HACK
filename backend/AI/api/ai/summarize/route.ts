import { NextResponse } from "next/server"
import { ai } from "@/backend/AI/lib/ai-client"
import { SUMMARIZE_SYSTEM } from "@/backend/AI/lib/ai-prompts"
import { extractJson } from "@/backend/AI/lib/ai-parser"
import type { Summary, SummarizeRequest } from "@/backend/AI/lib/ai-schemas"

const EMPTY_RESULT: Summary = {
  resume: "Aucun commentaire significatif fourni.",
  points_forts: [],
  points_faibles: [],
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string")
}

function parseSummary(input: unknown): Summary {
  if (!input || typeof input !== "object") {
    throw new Error("GROK: sortie non-object pour Summary")
  }

  const obj = input as Record<string, unknown>

  const resume = obj.resume
  const points_forts = obj.points_forts
  const points_faibles = obj.points_faibles

  if (typeof resume !== "string") {
    throw new Error("GROK: Summary.resume invalide")
  }

  if (!isStringArray(points_forts)) {
    throw new Error("GROK: Summary.points_forts invalide")
  }

  if (!isStringArray(points_faibles)) {
    throw new Error("GROK: Summary.points_faibles invalide")
  }

  return { resume, points_forts, points_faibles }
}

export async function POST(req: Request) {
  try {
    const body: SummarizeRequest = await req.json()
    const commentaires: string[] = (body.commentaires ?? [])
      .map((c: string) => c.trim())
      .filter((c: string) => c.length >= 2)

    if (commentaires.length === 0) {
      return NextResponse.json(EMPTY_RESULT, { status: 200 })
    }

    const numbered = commentaires
      .map((c, i) => `${i + 1}. ${c}`)
      .join("\n")

    const response = await ai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SUMMARIZE_SYSTEM },
        { role: "user", content: `Commentaires :\n\n${numbered}` },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "Reponse vide du LLM" }, { status: 502 })
    }

    const parsed = extractJson(content)
    const summary = parseSummary(parsed)
    return NextResponse.json(summary)
  } catch (error) {
    console.error("[/api/ai/summarize]", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    )
  }
}

