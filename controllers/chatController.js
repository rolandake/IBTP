// controllers/chatController.js

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    // Simuler une réponse IA basique (à remplacer par ta logique OpenAI ou autre)
    const response = `Tu as envoyé : ${message}`;
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
