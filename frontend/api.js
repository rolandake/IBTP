// frontend/api.js

const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error('Erreur réseau');
    }
    const data = await response.json();
    return data; // liste des projets
  } catch (error) {
    console.error('Erreur fetchProjects:', error);
    throw error;
  }
}
