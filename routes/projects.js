import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

// ...

// ✅ Rapport PDF
router.get("/:id/report", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="rapport-${project.name}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text(`Rapport du Projet: ${project.name}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Description : ${project.description || "N/A"}`);
    doc.text(`Statut : ${project.status}`);
    doc.text(`Progression : ${project.progress || 0}%`);
    doc.text(`Créé le : ${new Date(project.createdAt).toLocaleDateString()}`);

    // Ajout des tâches
    if (project.tasks && project.tasks.length > 0) {
      doc.moveDown().text("Tâches :", { underline: true });
      project.tasks.forEach((task, i) => {
        const overdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.done;
        doc.text(
          `• ${task.title} - ${task.done ? "✅" : overdue ? "⏰ EN RETARD" : "❌"} - ${
            task.dueDate ? `Échéance : ${new Date(task.dueDate).toLocaleDateString()}` : "Pas de date"
          }`
        );
      });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la génération du PDF" });
  }
});

// ✅ Export Excel
router.get("/:id/export-excel", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet introuvable" });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Projet");

    sheet.addRow(["Nom du projet", project.name]);
    sheet.addRow(["Statut", project.status]);
    sheet.addRow(["Progression", `${project.progress || 0}%`]);
    sheet.addRow(["Description", project.description]);
    sheet.addRow(["Date de création", new Date(project.createdAt).toLocaleDateString()]);
    sheet.addRow([]);
    sheet.addRow(["Tâches"]);
    sheet.addRow(["Titre", "Statut", "Échéance"]);

    project.tasks.forEach((task) => {
      sheet.addRow([
        task.title,
        task.done ? "Fait" : "Non fait",
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Aucune",
      ]);
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="export-${project.name}.xlsx"`
    );
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Erreur export Excel :", err);
    res.status(500).json({ message: "Erreur export Excel" });
  }
});
