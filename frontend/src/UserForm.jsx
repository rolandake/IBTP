import { useState, useEffect } from 'preact/hooks';
import { addUser, updateUser } from './api';

export default function UserForm({ userToEdit, clearEdit }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setNom(userToEdit.nom);
      setEmail(userToEdit.email);
    } else {
      setNom('');
      setEmail('');
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userToEdit) {
      await updateUser(userToEdit._id, { nom, email });
      clearEdit();
    } else {
      await addUser({ nom, email });
    }
    setNom('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        value={nom}
        onInput={(e) => setNom(e.target.value)}
        placeholder="Nom"
        required
        className="w-full p-2 border rounded"
      />
      <input
        value={email}
        onInput={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        type="email"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {userToEdit ? 'Mettre à jour' : 'Ajouter'}
      </button>
      {userToEdit && (
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
