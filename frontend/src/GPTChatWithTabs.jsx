import { useState, useEffect } from "preact/hooks";

export default function GPTChatWithTabs() {
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null); // ID conversation en cours de renommage
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/gpt/history");
      if (!res.ok) throw new Error("Erreur récupération historique");
      const data = await res.json();
      setConversations(data.conversations);

      if (data.conversations.length > 0) {
        loadConversation(data.conversations[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadConversation(id) {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/gpt/history/${id}`);
      if (!res.ok) throw new Error("Conversation non trouvée");
      const data = await res.json();
      setCurrentConv(data.conversation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteConversation(id) {
    if (!confirm("Supprimer cette conversation ?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/gpt/history/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setConversations((convs) => convs.filter((c) => c._id !== id));
      if (currentConv?._id === id) setCurrentConv(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Lance l'édition du nom d'une conversation
  function startEditing(id, currentName) {
    setEditingId(id);
    setNewName(currentName || "");
  }

  // Enregistre le nouveau nom côté backend
  async function saveNewName(id) {
    if (!newName.trim()) {
      alert("Le nom ne peut pas être vide.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/gpt/history/${id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) throw new Error("Erreur lors du renommage");
      const data = await res.json();
      // Mise à jour locale
      setConversations((convs) =>
        convs.map((c) => (c._id === id ? { ...c, name: newName } : c))
      );
      setEditingId(null);
      // Si la conversation courante est renommée, on la met à jour aussi
      if (currentConv?._id === id) {
        setCurrentConv((conv) => ({ ...conv, name: newName }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredConversations = conversations.filter(({ createdAt, name }) => {
    const searchLower = searchTerm.toLowerCase();
    const dateStr = new Date(createdAt).toLocaleString().toLowerCase();
    const nameStr = (name || "").toLowerCase();
    return dateStr.includes(searchLower) || nameStr.includes(searchLower);
  });

  return (
    <div className="flex h-[80vh] shadow rounded bg-white overflow-hidden">
      <aside className="w-64 border-r border-gray-300 overflow-auto p-2 bg-gray-50 flex flex-col">
        <h2 className="font-semibold mb-2">Conversations</h2>

        <input
          type="text"
          placeholder="Recherche par date ou nom..."
          className="mb-2 p-1 rounded border border-gray-300"
          value={searchTerm}
          onInput={(e) => setSearchTerm(e.target.value)}
        />

        {loading && <p>Chargement...</p>}
        {error && (
          <p className="text-red-600 text-sm mb-2">
            Erreur : {error}
          </p>
        )}

        <ul className="flex-1 overflow-auto">
          {filteredConversations.length === 0 && !loading && (
            <li className="text-gray-500">Aucune conversation</li>
          )}

          {filteredConversations.map(({ _id, createdAt, name }) => (
            <li
              key={_id}
              className={`p-2 mb-1 rounded cursor-pointer flex justify-between items-center ${
                currentConv?._id === _id ? "bg-blue-200 font-semibold" : "hover:bg-gray-100"
              }`}
              onClick={() => loadConversation(_id)}
            >
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                {editingId === _id ? (
                  <>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={newName}
                      onInput={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveNewName(_id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                    />
                    <button
                      className="text-green-600 text-xs ml-1"
                      onClick={() => saveNewName(_id)}
                    >
                      ✔
                    </button>
                    <button
                      className="text-red-600 text-xs ml-1"
                      onClick={() => setEditingId(null)}
                    >
                      ✖
                    </button>
                  </>
                ) : (
                  <span
                    title={name || "Aucun nom"}
                    onDoubleClick={() => startEditing(_id, name)}
                  >
                    {name?.trim() !== "" ? name : new Date(createdAt).toLocaleString()}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(_id);
                }}
                className="text-red-500 hover:text-red-700 text-xs ml-2"
                title="Supprimer"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-1 flex flex-col p-4">
        {!currentConv && (
          <div className="text-gray-500 m-auto select-none">
            Sélectionne une conversation pour voir les messages
          </div>
        )}

        {currentConv && (
          <>
            <h3 className="font-bold mb-3">
              {currentConv.name?.trim() !== ""
                ? currentConv.name
                : `Conversation du ${new Date(currentConv.createdAt).toLocaleString()}`}
            </h3>
            <div className="flex-1 overflow-auto border rounded p-2 bg-gray-100">
              {currentConv.messages.length === 0 && (
                <p className="text-gray-500">Pas de messages</p>
              )}
              {currentConv.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded ${
                    msg.role === "user" ? "bg-blue-200 text-black self-end" : "bg-gray-300"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <strong>{msg.role === "user" ? "Vous" : "Assistant"}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
