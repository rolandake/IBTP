import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/auth.js"; // adapte selon ton projet
import Project from "../models/Project.js"; // adapte selon ton projet

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Suppression projet (existant)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur suppression projet" });
  }
});

// Upload fichier lié au projet
router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier envoyé" });
      }

      // Ici tu peux relier ce fichier à ton projet en base, ex :
      // const project = await Project.findById(req.params.id);
      // project.files.push({ name: req.file.originalname, path: req.file.path });
      // await project.save();

      res.json({
        message: "Fichier uploadé",
        file: {
          originalName: req.file.originalname,
          path: req.file.path,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'upload" });
    }
  }
);

export default router;
