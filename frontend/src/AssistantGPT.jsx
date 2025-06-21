import { useState } from 'preact/hooks';

export default function AssistantGPT() {
  const [prompt, setPrompt] = useState('');
  const [reponse, setReponse] = useState('');
  const [chargement, setChargement] = useState(false);

  const envoyer = async () => {
    if (!prompt.trim()) return;
    setChargement(true);
    setReponse('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setReponse(data.response || 'Erreur serveur');
    } catch (err) {
      setReponse('Erreur de connexion');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onInput={(e) => setPrompt(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Pose ta question BTP ici..."
      />
      <button
        onClick={envoyer}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={chargement}
      >
        {chargement ? 'Envoi...' : 'Envoyer'}
      </button>

      {reponse && (
        <div className="mt-4 p-4 bg-white border rounded shadow">
          <strong>Réponse GPT :</strong>
          <p className="mt-2 whitespace-pre-line">{reponse}</p>
        </div>
      )}
    </div>
  );
}
