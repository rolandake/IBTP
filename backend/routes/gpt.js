```js
import express from "express";
import { askOpenAI } from "../utils/openaiService.js";
import authMiddleware from "../middlewares/auth.js";
import Conversation from "../models/Conversation.js";
import { btpPrompts } from "../utils/btpPrompts.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { prompt, conversationId, category } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt manquant" });
  }

  try {
    let fullPrompt = prompt;
    if (category && btpPrompts[category]) {
      fullPrompt = btpPrompts[category] + prompt;
    }

    const response = await askOpenAI(fullPrompt);
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== userId) {
        return res.status(404).json({ message: "Conversation introuvable" });
      }
      conversation.messages.push(
        { role: "user", content: fullPrompt },
        { role: "assistant", content: response }
      );
      await conversation.save();
    } else {
      conversation = new Conversation({
        user: userId,
        messages: [
          { role: "user", content: fullPrompt },
          { role: "assistant", content: response },
        ],
      });
      await conversation.save();
    }

    res.json({ response, conversationId: conversation._id });
  } catch (error) {
    console.error("Erreur GPT:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ... (autres routes : GET history, GET conversation, PUT rename, DELETE)

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Conversation.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("_id title createdAt messages");

    const summaries = history.map((conv) => ({
      id: conv._id,
      title: conv.title || "Sans titre",
      preview: conv.messages[0]?.content?.slice(0, 50) || "Conversation",
      date: conv.createdAt,
    }));

    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération historique" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const conv = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conv) return res.status(404).json({ message: "Conversation introuvable" });

    res.json(conv.messages);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id/rename", authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const conv = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true }
    );

    if (!conv) return res.status(404).json({ message: "Conversation introuvable" });

    res.json({ success: true, title: conv.title });
  } catch (err) {
    res.status(500).json({ message: "Erreur renommage" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Conversation introuvable" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression" });
  }
});

export default router;


