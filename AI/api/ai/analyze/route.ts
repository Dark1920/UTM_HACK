import { NextResponse } from "next/server"
<<<<<<< HEAD
import { ai } from "@/AI/lib/ai-client"
=======
import { getGrokClient } from "@/AI/lib/ai-client"
>>>>>>> 66b021b (Fix prompts and AI routes)
import { ANALYZE_SYSTEM } from "@/AI/lib/ai-prompts"
import { extractJson } from "@/AI/lib/ai-parser"
import type { ReviewAnalysis, AnalyzeRequest } from "@/AI/lib/ai-schemas"

const MIN_LENGTH = 2

function preValidate(commentaire: string): boolean {
  const cleaned = commentaire.trim()
<<<<<<< HEAD
=======

>>>>>>> 66b021b (Fix prompts and AI routes)
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

<<<<<<< HEAD
    const response = await ai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
=======
    const response = await getGrokClient().chat.completions.create({
      model: process.env.GROK_MODEL || "grok-beta",
>>>>>>> 66b021b (Fix prompts and AI routes)
      messages: [
        { role: "system", content: ANALYZE_SYSTEM },
        { role: "user", content: `Analyse ce commentaire :\n\n${commentaire}` },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "Reponse vide du LLM" }, { status: 502 })
    }

    const parsed = extractJson(content) as ReviewAnalysis
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[/api/ai/analyze]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

