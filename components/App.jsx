import { useState } from 'react';

const onglets = ['Chat GPT', 'Projets', 'Profil'];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Tu es un assistant BTP IA.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const envoyerMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, data.message]);
      }
    } catch (err) {
      alert('Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans min-h-screen flex flex-col">
      <nav className="flex space-x-4 border-b mb-4">
        {onglets.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`py-2 px-4 font-semibold ${
              activeTab === i ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 0 && (
        <section className="flex flex-col flex-grow border rounded p-4 bg-white shadow">
          <div className="flex-grow overflow-auto mb-4 max-h-[60vh]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded ${
                  m.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
                } max-w-[75%]`}
              >
                <strong>{m.role === 'user' ? 'Vous' : 'Assistant'}: </strong>{m.content}
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && envoyerMessage()}
              placeholder="Tapez votre message..."
              className="flex-grow border rounded px-3 py-2"
              disabled={loading}
            />
            <button
              onClick={envoyerMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? '...' : 'Envoyer'}
            </button>
          </div>
        </section>
      )}

      {activeTab === 1 && (
        <section>
          <h2 className="text-xl font-bold">Projets BTP</h2>
          <p>À développer…</p>
        </section>
      )}

      {activeTab === 2 && (
        <section>
          <h2 className="text-xl font-bold">Profil utilisateur</h2>
          <p>À développer…</p>
        </section>
      )}
    </div>
  );
}
