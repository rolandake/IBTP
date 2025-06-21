import express from "express";
import { askOpenAI } from "../utils/openaiService.js";
import Conversation from "../models/Conversation.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Protection de toutes les routes
router.use(authMiddleware);

// Récupérer l’historique des conversations utilisateur
router.get("/history", async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ createdAt: 1 });
    // Retourner uniquement rôle et contenu pour éviter d’exposer d’autres champs
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

    // Enregistrer la requête utilisateur
    await Conversation.create({ userId: req.user.id, role: "user", content: prompt });

    // Appeler OpenAI
    const answer = await askOpenAI(prompt);

    // Enregistrer la réponse assistant
    await Conversation.create({ userId: req.user.id, role: "assistant", content: answer });

    // Renvoyer la réponse à l’utilisateur
    res.json({ answer });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ message: "Erreur serveur OpenAI" });
  }
});

export default router;
