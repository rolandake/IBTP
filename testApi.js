import fetch from 'node-fetch';

async function testSignup() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
    });
    const data = await res.json();
    console.log('Réponse API signup:', data);
  } catch (err) {
    console.error('Erreur test API:', err);
  }
}

testSignup();
