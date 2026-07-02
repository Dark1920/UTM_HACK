import { NextResponse } from "next/server"
import { ai } from "@/lib/ia/client"
import { RESPOND_SYSTEM } from "@/lib/ia/prompts"

interface RespondRequest {
  avis: string
  note?: number
}

// POST /api/ai/respond  { avis, note? }
// Génère, au nom de l'artisan, une réponse professionnelle à un avis client.
export async function POST(req: Request) {
  try {
    const body: RespondRequest = await req.json()
    const avis = body.avis?.trim()

    if (!avis) {
      return NextResponse.json({ error: "Avis manquant" }, { status: 400 })
    }

    const note = typeof body.note === "number" ? body.note : null
    const userContent = note !== null ? `Avis (note ${note}/5) :\n\n${avis}` : `Avis :\n\n${avis}`

    const response = await ai.chat.completions.create({
      model: process.env.AI_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: RESPOND_SYSTEM },
        { role: "user", content: userContent },
      ],
      temperature: 0.5,
    })

    const reponse = response.choices[0]?.message?.content?.trim()
    if (!reponse) {
      return NextResponse.json({ error: "Reponse vide du LLM" }, { status: 502 })
    }

    return NextResponse.json({ reponse })
  } catch (error) {
    console.error("[/api/ai/respond]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
