import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import gptRoutes from "./routes/gpt.js";

// Charger les variables d’environnement AVANT tout
dotenv.config();

// Vérification des clés
console.log("🔑 OPENAI_API_KEY :", process.env.OPENAI_API_KEY ? "✅ OK" : "❌ NON TROUVÉE");
console.log("📦 MONGODB_URI brut :", `"${process.env.MONGODB_URI || process.env.MONGO_URI}"`);

const app = express();
const PORT = process.env.PORT || 5000;

// Protection anti-abus
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});

app.use(cors());
app.use(limiter);
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/gpt", gptRoutes);

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connecté avec succès !");
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err.message);
  });
