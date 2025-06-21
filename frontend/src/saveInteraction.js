export async function saveInteraction(prompt, response) {
  const token = localStorage.getItem('token')
  await fetch('http://localhost:5000/api/saveInteraction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ prompt, response })
  })
}
