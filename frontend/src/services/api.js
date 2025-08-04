import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/register', userData),
  login: (credentials) => api.post('/api/login', credentials),
};

// Habits API
export const habitsAPI = {
  getHabits: () => api.get('/api/habits'),
  createHabit: (habitData) => api.post('/api/habits', habitData),
  completeHabit: (habitId) => api.post('/api/complete-habit', { habit_id: habitId }),
  getCompletedHabits: () => api.get('/api/completed-habits'),
  getProgress: () => api.get('/api/progress'),
};

export default api;