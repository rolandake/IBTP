import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProjetList() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projets')
      .then(res => {
        setProjets(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Erreur inconnue');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <ul>
      {projets.map(p => (
        <li key={p._id}>{p.nom}</li>
      ))}
    </ul>
  );
}
