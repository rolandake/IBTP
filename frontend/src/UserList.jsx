import { useEffect, useState } from 'preact/hooks';
import { getUsers, deleteUser } from './api';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div>
      <UserForm userToEdit={editUser} clearEdit={() => { setEditUser(null); fetchUsers(); }} />
      <ul className="space-y-1 text-sm list-disc list-inside">
        {users.map((u) => (
          <li key={u._id} className="flex justify-between items-center">
            <span>
              <strong>{u.nom}</strong> ({u.email})
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setEditUser(u)}
                className="text-blue-600 hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
