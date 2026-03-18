export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  transaction_date: string;
  description: string;
}

export interface Loan {
  id: string;
  user_id: string;
  type: 'borrowed' | 'lent';
  counterparty: string;
  amount: number;
  interest_rate?: number;
  start_date?: string;
  due_date?: string;
  status: 'active' | 'completed';
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline?: string;
  status: 'todo' | 'done';
}

export interface User {
  id: string;
  email: string;
}
