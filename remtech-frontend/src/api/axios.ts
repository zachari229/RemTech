import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Intercepteur requête — ajouter le token JWT + gérer le Content-Type dynamiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('remtech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si on envoie du FormData (fichiers), on laisse Axios/le navigateur
    // définir automatiquement le Content-Type avec le bon "boundary".
    // Sinon, on force du JSON.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur réponse — gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('remtech_token');
      localStorage.removeItem('remtech_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;