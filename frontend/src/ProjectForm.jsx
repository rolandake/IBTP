import { useState, useEffect } from 'preact/hooks';
import { addProject, updateProject } from './api';

export default function ProjectForm({ projectToEdit, clearEdit }) {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setNom(projectToEdit.nom);
      setDescription(projectToEdit.description);
    } else {
      setNom('');
      setDescription('');
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectToEdit) {
      await updateProject(projectToEdit._id, { nom, description });
      clearEdit();
    } else {
      await addProject({ nom, description });
    }
    setNom('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        value={nom}
        onInput={(e) => setNom(e.target.value)}
        placeholder="Nom du projet"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onInput={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {projectToEdit ? 'Mettre à jour' : 'Créer'}
      </button>
      {projectToEdit && (
        <button
          type="button"
          onClick={clearEdit}
          className="w-full mt-2 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Annuler
        </button>
      )}
    </form>
  );
}
