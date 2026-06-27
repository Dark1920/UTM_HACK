import { NextResponse } from "next/server"
<<<<<<<< HEAD:backend/AI/api/ai/voice-search/route.ts
import { ai } from "@/backend/AI/lib/ai-client"
import { VOICE_SEARCH_SYSTEM } from "@/backend/AI/lib/ai-prompts"
import { extractJson } from "@/backend/AI/lib/ai-parser"
========
import { ai } from "@/lib/ia/client"
import { VOICE_SEARCH_SYSTEM } from "@/lib/ia/prompts"
import { extractJson } from "@/lib/ia/parser"
>>>>>>>> 0e7fa398639f80e5fe150b540126473268eb5bbd:artisanbf/src/app/api/ai/voice-search/route.ts

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("audio") as File | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier audio fourni" }, { status: 400 })
    }

    const transcription = await ai.audio.transcriptions.create({
      model: "whisper-large-v3",
      file: file,
      language: "fr",
    })

    const texte = transcription.text

    if (!texte || texte.trim().length < 2) {
      return NextResponse.json({
        texte: "",
        intention: "incomprehensible",
        categorie: null,
        quartier: null,
      })
    }

    const response = await ai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: VOICE_SEARCH_SYSTEM },
        { role: "user", content: texte },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "Reponse vide du LLM" }, { status: 502 })
    }

    const parsed = extractJson(content) as {
      intention: string
      categorie: string | null
      quartier: string | null
      urgence: boolean
    }

    return NextResponse.json({ texte, ...parsed })
  } catch (error) {
    console.error("[/api/ai/voice-search]", error)
    return NextResponse.json(
      { error: "Erreur lors de la recherche vocale" },
      { status: 500 }
    )
  }
}
