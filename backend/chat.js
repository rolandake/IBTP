import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body; // messages : [{ role, content }, ...]

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages is required and must be an array' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    res.json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
