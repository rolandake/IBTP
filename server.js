import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import gptRoutes from "./routes/gpt.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting (exemple : 60 requêtes / minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});

app.use(cors());
app.use(limiter);
app.use(express.json());

// Routes
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
    console.log("✅ MongoDB connecté");
    app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err);
  });
