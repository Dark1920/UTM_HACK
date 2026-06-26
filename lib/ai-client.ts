import OpenAI from "openai"

export const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: process.env.GROK_BASE_URL || "https://api.x.ai/v1",
})
