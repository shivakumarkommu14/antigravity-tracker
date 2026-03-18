"use client";
import { useEffect, useState } from 'react';
import { fetchLoans } from '@/lib/api';
import { ArrowLeftRight, Calendar } from 'lucide-react';
import { Loan } from '@/types';

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetchLoans().then(setLoans).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
        Lending Portfolio
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100 md:col-span-2">No active loans. Try asking the Agent: &apos;lent $500 to Bob&apos;</div>
        ) : (
          loans.map((loan: Loan) => (
            <div key={loan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${loan.type === 'borrowed' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {loan.type}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${loan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {loan.status}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-2">${loan.amount.toFixed(2)}</div>
              <div className="flex items-center gap-2 text-slate-600 font-medium mb-4">
                <ArrowLeftRight size={18} className="text-slate-400" /> Counterparty: {loan.counterparty}
              </div>
              {loan.due_date && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded">
                  <Calendar size={16} /> Due: {loan.due_date}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
