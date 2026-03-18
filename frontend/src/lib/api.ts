import axios from 'axios';
import { Task, Transaction, Loan } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

export interface AgentResponse {
  status: string;
  message: string;
  data: any;
}

export const fetchTasks = (): Promise<Task[]> => api.get('/tasks').then(res => res.data);
export const fetchTransactions = (): Promise<Transaction[]> => api.get('/transactions').then(res => res.data);
export const fetchLoans = (): Promise<Loan[]> => api.get('/loans').then(res => res.data);
export const agentCommand = (prompt: string): Promise<AgentResponse> => api.post('/api/agent', { prompt }).then(res => res.data);
