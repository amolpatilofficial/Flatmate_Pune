import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      config.headers['Authorization'] = `Bearer ${parsedUser.id}`;
    } catch (e) {}
  }
  return config;
});

export default api;
