// controllers/projectsController.js

// Exemple de gestion en mémoire (à remplacer par base de données)
let projects = [];

// Créer un projet
export const createProject = (req, res) => {
  const { name, description } = req.body;
  const newProject = { id: projects.length + 1, name, description };
  projects.push(newProject);
  res.status(201).json(newProject);
};

// Récupérer tous les projets
export const getProjects = (req, res) => {
  res.json(projects);
};

// Supprimer un projet par id
export const deleteProject = (req, res) => {
  const { id } = req.params;
  projects = projects.filter((p) => p.id !== Number(id));
  res.json({ message: `Projet ${id} supprimé` });
};
