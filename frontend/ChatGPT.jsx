import React, { useState, useEffect } from "react";

export default function ChatGPT({ token }) {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const res = await fetch("http://localhost:5000/api/gpt/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Erreur chargement conversations :", err);
    }
  }

  async function loadConversation(id) {
    try {
      setActiveConvId(id);
      const res = await fetch(`http://localhost:5000/api/gpt/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Erreur chargement conversation :", err);
    }
  }

  async function sendPrompt() {
    if (!prompt) return;

    try {
      const res = await fetch("http://localhost:5000/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          conversationId: activeConvId,
          category,
        }),
      });

      if (res.ok) {
        const { response, conversationId } = await res.json();

        if (!activeConvId) setActiveConvId(conversationId);

        setMessages((prev) => [
          ...prev,
          { role: "user", content: prompt },
          { role: "assistant", content: response },
        ]);

        setPrompt("");
        setCategory("");
        fetchConversations();
      } else {
        console.error("Erreur de réponse GPT :", await res.text());
      }
    } catch (err) {
      console.error("Erreur envoi prompt :", err);
    }
  }

  return (
    <div>
      <div>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">Général</option>
          <option value="metrage">Calcul métrés</option>
          <option value="securite">Normes sécurité</option>
          <option value="materiaux">Conseils matériaux</option>
          <option value="planning">Planning chantier</option>
          <option value="diagnostic">Diagnostic technique</option>
        </select>
      </div>

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Tape ta question ici..."
      />

      <button onClick={sendPrompt}>Envoyer</button>

      <hr />

      <div>
        <h3>Conversations</h3>
        {conversations.map((conv) => (
          <div key={conv._id}>
            <button onClick={() => loadConversation(conv._id)}>
              Conversation du {new Date(conv.createdAt).toLocaleString()}
            </button>
          </div>
        ))}
      </div>

      <hr />

      <div>
        <h3>Messages</h3>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "10px 0" }}
          >
            <b>{msg.role === "user" ? "Vous" : "Assistant"} :</b> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
