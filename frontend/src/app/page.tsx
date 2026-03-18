"use client";
import { useEffect, useState } from 'react';
import { fetchTasks, fetchTransactions, fetchLoans } from '@/lib/api';
import AgentBox from '@/components/AgentBox';
import { CheckCircle2, CircleDollarSign, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [txns, setTxns] = useState([]);
  const [loans, setLoans] = useState([]);

  const loadData = async () => {
    try {
      const ts = await fetchTasks();
      const fs = await fetchTransactions();
      const ls = await fetchLoans();
      if(Array.isArray(ts)) setTasks(ts);
      if(Array.isArray(fs)) setTxns(fs);
      if(Array.isArray(ls)) setLoans(ls);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const pendingTasks = tasks.filter((t: any) => t.status !== 'done').length;
  const doneTasks = tasks.filter((t: any) => t.status === 'done').length;

  const income = txns.filter((t: any) => t.type === 'income').reduce((acc, t: any) => acc + t.amount, 0);
  const expenses = txns.filter((t: any) => t.type === 'expense').reduce((acc, t: any) => acc + t.amount, 0);
  const netWorth = income - expenses;

  // Chart prep
  const financeData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses }
  ];
  
  const tasksData = [
    { name: 'Pending', value: pendingTasks },
    { name: 'Completed', value: doneTasks }
  ];

  const FINANCE_COLORS = ['#10b981', '#f43f5e']; 
  const TASKS_COLORS = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 drop-shadow-sm">
        Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><CheckCircle2 size={36}/></div>
          <div>
            <div className="text-sm text-slate-400 font-semibold tracking-wide uppercase">Total Tasks</div>
            <div className="text-3xl font-black text-slate-800">{tasks.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><CircleDollarSign size={36}/></div>
          <div>
            <div className="text-sm text-slate-400 font-semibold tracking-wide uppercase">Net Balance</div>
            <div className="text-3xl font-black text-slate-800">${netWorth.toFixed(2)}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-purple-50 text-purple-500 rounded-2xl"><AlertCircle size={36}/></div>
          <div>
            <div className="text-sm text-slate-400 font-semibold tracking-wide uppercase">Active Loans</div>
            <div className="text-3xl font-black text-slate-800">{loans.length}</div>
          </div>
        </div>
      </div>

      <AgentBox onAction={loadData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[400px]">
            <h2 className="text-xl font-bold mb-2 text-slate-800">Task Completion</h2>
             <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={tasksData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} stroke="none" paddingAngle={5}>
                   {tasksData.map((entry, index) => <Cell key={index} fill={TASKS_COLORS[index % TASKS_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[400px]">
            <h2 className="text-xl font-bold mb-2 text-slate-800">Income vs Expenses</h2>
             <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={financeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} stroke="none" paddingAngle={5}>
                   {financeData.map((entry, index) => <Cell key={index} fill={FINANCE_COLORS[index % FINANCE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
