import { useState, useEffect } from 'preact/hooks';

export default function HistoriqueGPT() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const charger = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/gpt/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    };
    charger();
  }, []);

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <p>Aucun message trouvé.</p>
      ) : (
        messages.map((m) => (
          <div key={m._id} className="bg-white p-4 border rounded shadow">
            <p><strong>❓ Question :</strong> {m.prompt}</p>
            <p className="mt-2 whitespace-pre-line"><strong>🤖 Réponse :</strong> {m.response}</p>
            <p className="text-sm text-gray-500 mt-1">{new Date(m.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
