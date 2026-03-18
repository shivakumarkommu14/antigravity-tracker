import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const fetchTasks = () => api.get('/tasks').then(res => res.data);
export const fetchTransactions = () => api.get('/transactions').then(res => res.data);
export const fetchLoans = () => api.get('/loans').then(res => res.data);
export const agentCommand = (prompt: string) => api.post('/api/agent', { prompt }).then(res => res.data);
