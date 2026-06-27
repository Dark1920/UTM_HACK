import { NextResponse } from "next/server"
<<<<<<<< HEAD:backend/AI/api/ai/speech-to-text/route.ts
import { ai } from "@/backend/AI/lib/ai-client"
========
import { ai } from "@/lib/ia/client"
>>>>>>>> 0e7fa398639f80e5fe150b540126473268eb5bbd:artisanbf/src/app/api/ai/speech-to-text/route.ts

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("audio") as File | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier audio fourni" }, { status: 400 })
    }

    const response = await ai.audio.transcriptions.create({
      model: "whisper-large-v3",
      file: file,
      language: "fr",
    })

    return NextResponse.json({ text: response.text })
  } catch (error) {
    console.error("[/api/ai/speech-to-text]", error)
    return NextResponse.json(
      { error: "Erreur lors de la transcription" },
      { status: 500 }
    )
  }
}
