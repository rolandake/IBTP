import { useState } from 'preact/hooks';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajouter logique inscription ici
    alert(`Inscription avec ${email}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input type="email" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onInput={e => setPassword(e.target.value)} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
