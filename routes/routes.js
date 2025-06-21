import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Conversation from "../models/messageModel.js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/gpt/chat - Envoie un message et sauvegarde la conversation
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    const assistantMessage = completion.choices[0].message;

    // Sauvegarde dans MongoDB : crée une nouvelle conversation avec tous les messages
    const conversation = new Conversation({
      messages: [...messages, assistantMessage],
    });
    await conversation.save();

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec OpenAI." });
  }
});

// GET /api/gpt/history - Récupère les 10 dernières conversations
router.get("/history", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ conversations });
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l’historique." });
  }
});

export default router;
