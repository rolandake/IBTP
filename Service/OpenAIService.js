import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fonction asynchrone qui envoie une requête à OpenAI et retourne la réponse texte
export async function askOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // adapte selon le modèle que tu utilises
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

export default openai;
