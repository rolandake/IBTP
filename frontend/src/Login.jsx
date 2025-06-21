```jsx
import { TextField, Button, Typography, Container } from "@mui/material";
import { useState } from "react";
export default function LoginRegister({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const url = http://localhost:5000/api/auth/${isLogin ? "login" : "register"};
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      localStorage.setItem("btp-token", data.token);
      onAuth(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>

      <Typography variant="h4" gutterBottom>
        {isLogin ? "Connexion" : "Inscription"}
      </Typography>

      {!isLogin && (
        <TextField
          name="username"
          label="Nom"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />
      )}

      <TextField
        name="email"
        label="Email"
        fullWidth
        margin="normal"
        value={form.email}
        onChange={handleChange}
      />

      <TextField
        name="password"
        label="Mot de passe"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />

      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
        {isLogin ? "Se connecter" : "Créer un compte"}
      </Button>

      <Button onClick={() => setIsLogin(!isLogin)} sx={{ mt: 1 }}>
        {isLogin ? "Créer un compte" : "Déjà inscrit ? Connexion"}
      </Button>
    </Container>
  );
}


---
