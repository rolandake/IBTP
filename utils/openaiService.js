import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askOpenAI(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Assure-toi que ce modèle est disponible pour toi
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    throw error;
  }
}
