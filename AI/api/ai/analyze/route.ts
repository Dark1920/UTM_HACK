import { NextResponse } from "next/server"
import { grok } from "@/AI/lib/ai-client"
import { ANALYZE_SYSTEM } from "@/AI/lib/ai-prompts"
import { extractJson } from "@/AI/lib/ai-parser"
import type { ReviewAnalysis, AnalyzeRequest } from "@/AI/lib/ai-schemas"

const MIN_LENGTH = 2

function preValidate(commentaire: string): boolean {
  const cleaned = commentary.trim()
  if (cleaned.length < MIN_LENGTH) return false
  if ((cleaned.match(/#/g) || []).length > cleaned.length * 0.5) return false
  return true
}

const DEFAULT_RESULT: ReviewAnalysis = {
  pertinent: false,
  note: 0,
  sentiment: "neutre",
  criteres: { qualite: 0, professionnalisme: 0, rapidite: 0, prix: 0 },
  points_forts: [],
  points_faibles: [],
  raison: "Commentaire vide ou non pertinent (filtrage deterministe).",
}

export async function POST(req: Request) {
  try {
    const body: AnalyzeRequest = await req.json()
    const commentaire = body.commentaire?.trim()

    if (!commentaire) {
      return NextResponse.json(DEFAULT_RESULT, { status: 200 })
    }

    if (!preValidate(commentaire)) {
      return NextResponse.json(DEFAULT_RESULT, { status: 200 })
    }

    const response = await grok.chat.completions.create({
      model: process.env.GROK_MODEL || "grok-beta",
      messages: [
        { role: "system", content: ANALYZE_SYSTEM },
        { role: "user", content: `Analyse ce commentaire :\n\n${commentaire}` },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "Reponse vide de GROK" }, { status: 502 })
    }

    const parsed = extractJson(content) as ReviewAnalysis
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[/api/ai/analyze]", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
