```js
import Conversation from "../models/Conversation.js";
import { askOpenAI } from "../utils/openaiService.js";

export const getHistory = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id }).sort({ createdAt: 1 });
    // Format simple pour frontend
    const messages = conversations.map(c => ({
      role: c.role,
      content: c.content,
    }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération historique" });
  }
};

export const chatWithGPT = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt manquant" });

    // Sauvegarde message utilisateur
    await Conversation.create({
      user: req.user._id,
      role: "user",content: prompt,
    });

    // Appel OpenAI
    const response = await askOpenAI(prompt);

    // Sauvegarde réponse GPT
    await Conversation.create({
      user: req.user._id,
      role: "assistant",
      content: response,
    });

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Erreur chat GPT", error });
  }
};


---
