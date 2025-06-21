import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

console.log("OPENAI_API_KEY dans openaiService.js :", process.env.OPENAI_API_KEY ? "OK" : "NON TROUVÉE");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fonction asynchrone qui envoie une requête à OpenAI et retourne la réponse texte
export async function askOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

export default openai;
