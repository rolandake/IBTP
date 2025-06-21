```js
import express from "express";
import { askOpenAI } from "../utils/openaiService.js";
import Conversation from "../models/Conversation.js";
import authMiddleware from "../middlewares/auth.js";const router = express.Router();
router.use(authMiddleware);

router.get("/history", async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(conversations.map(c => ({ role: c.role, content: c.content })));
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt manquant" });

    await Conversation.create({ userId: req.user.id, role: "user", content: prompt });
    const answer = await askOpenAI(prompt);
    await Conversation.create({ userId: req.user.id, role: "assistant", content: answer });

    res.json(answer);
  } catch {
    res.status(500).json({ message: "Erreur serveur OpenAI" });
  }
});

export default router;


---

