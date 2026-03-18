"use client";
import { useEffect, useState } from 'react';
import { fetchTransactions } from '@/lib/api';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Finance() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    fetchTransactions().then(res => {
        if(Array.isArray(res)) setTxns(res);
    }).catch(console.error);
  }, []);

  const expenses = txns.filter((t: any) => t.type === 'expense');
  
  // Group expenses by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((t: any) => {
    const cat = t.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
  });
  
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));
  
  const COLORS = ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
        Finance Tracker
      </h1>
      
      {categoryData.length > 0 && (
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[380px]">
            <h2 className="text-xl font-bold mb-2 text-slate-800">Expense Distribution</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} stroke="none" label paddingAngle={3}>
                   {categoryData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
         </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
         {txns.length === 0 ? (
           <div className="p-8 text-center text-slate-500">No transactions recorded. Tell the Agent to log an expense!</div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                   <th className="p-5">Type</th>
                   <th className="p-5">Description</th>
                   <th className="p-5">Amount</th>
                   <th className="p-5">Category</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {txns.map((txn: any) => (
                   <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="p-5">
                       {txn.type === 'income' 
                          ? <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit text-sm font-bold"><TrendingUp size={16}/> Income</div>
                          : <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg w-fit text-sm font-bold"><TrendingDown size={16}/> Expense</div>
                       }
                     </td>
                     <td className="p-5 font-semibold text-slate-800">{txn.description}</td>
                     <td className="p-5 font-black text-slate-900">${txn.amount.toFixed(2)}</td>
                     <td className="p-5 text-slate-500 text-sm">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg font-medium">{txn.category || 'General'}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>
    </div>
  );
}
