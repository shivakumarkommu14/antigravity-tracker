"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const res = await axios.post('http://127.0.0.1:8000/token', params);
      localStorage.setItem('token', res.data.access_token);
      router.push('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Login</h1>
        {error && <div className="mb-6 text-rose-600 bg-rose-50 p-4 rounded-xl text-sm font-medium">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input type="email" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2">Sign In</button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
