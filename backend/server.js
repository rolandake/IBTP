import express from "express";
import path from "path";

const app = express();

// ... tes middlewares, routes, etc.

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ... démarrage serveur
