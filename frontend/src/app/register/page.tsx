"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/register', { email, password });
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Email might exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Register</h1>
        {error && <div className="mb-6 text-rose-600 bg-rose-50 p-4 rounded-xl text-sm font-medium">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold rounded-xl py-4 hover:bg-emerald-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2">Create Account</button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account? <Link href="/login" className="text-emerald-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
