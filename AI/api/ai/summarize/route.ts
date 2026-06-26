import { NextResponse } from "next/server"
import { ai } from "@/AI/lib/ai-client"
import { SUMMARIZE_SYSTEM } from "@/AI/lib/ai-prompts"
import { extractJson } from "@/AI/lib/ai-parser"
import type { Summary, SummarizeRequest } from "@/AI/lib/ai-schemas"

const EMPTY_RESULT: Summary = {
  resume: "Aucun commentaire significatif fourni.",
  points_forts: [],
  points_faibles: [],
}

export async function POST(req: Request) {
  try {
    const body: SummarizeRequest = await req.json()
    const commentaires = body.commentaires
      ?.map((c) => c.trim())
      .filter((c) => c.length >= 2)

    if (!commentaires || commentaires.length === 0) {
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

    const parsed = extractJson(content) as Summary
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[/api/ai/summarize]", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
