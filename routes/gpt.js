import * as openaiService from "../utils/openaiService.js";

console.log("openaiService keys:", Object.keys(openaiService));
console.log("Type askOpenAI:", typeof openaiService.askOpenAI);

import express from "express";
import Conversation from "../models/Conversation.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Protection de toutes les routes
router.use(authMiddleware);

// Récupérer l’historique des conversations utilisateur
router.get("/history", async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(conversations.map(c => ({ role: c.role, content: c.content })));
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Endpoint chat GPT
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt manquant ou vide" });
    }

    await Conversation.create({ userId: req.user.id, role: "user", content: prompt });

    // Utilisation sécurisée avec openaiService.askOpenAI
    const answer = await openaiService.askOpenAI(prompt);

    await Conversation.create({ userId: req.user.id, role: "assistant", content: answer });

    res.json({ answer });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ message: "Erreur serveur OpenAI" });
  }
});

export default router;
