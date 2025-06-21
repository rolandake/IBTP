import { askGPT } from '../services/OpenAIService.js';

export const handleInteraction = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    // Appel GPT via le service coalesceur
    const response = await askGPT(message);

    // Enregistrer interaction en DB si besoin (exemple simplifié)
    // await Interaction.create({ user: req.user.id, message, response });

    res.json({ response });
  } catch (err) {
    console.error("Erreur interaction GPT:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
