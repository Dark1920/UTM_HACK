import OpenAI from "openai";

<<<<<<< HEAD
export const ai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
})
=======
/**
 * Récupère la configuration nécessaire pour communiquer avec l'API Grok.
 * Vérifie la présence de la clé API et définit l'URL de base.
 */
function getGrokConfig() {
  const apiKey = process.env.GROK_API_KEY;
  const baseURL = process.env.GROK_BASE_URL || "https://api.x.ai/v1";

  if (!apiKey) {
    throw new Error(
      "La variable d'environnement GROK_API_KEY est absente. Veuillez la configurer avant d'utiliser Grok."
    );
  }

  return { apiKey, baseURL };
}

/**
 * Instance unique (Singleton) du client Grok.
 * Le client est créé uniquement lors de la première utilisation.
 */
let grokClient: OpenAI | null = null;

/**
 * Retourne le client Grok.
 * Si le client n'existe pas encore, il est créé puis réutilisé
 * pour toutes les requêtes suivantes.
 */
export function getGrokClient(): OpenAI {
  if (grokClient) {
    return grokClient;
  }

  const { apiKey, baseURL } = getGrokConfig();

  grokClient = new OpenAI({
    apiKey,
    baseURL,
  });

  return grokClient;
}
>>>>>>> 66b021b (Fix prompts and AI routes)
