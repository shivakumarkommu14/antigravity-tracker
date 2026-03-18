"use client";
import { useEffect, useState } from 'react';
import { fetchTasks, api } from '@/lib/api';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      setTasks(await fetchTasks());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleToggle = async (id: string, currentStatus: string) => {
    // Basic mock toggle since the backend doesn't have a PATCH endpoint yet
    alert('Task toggle - requires backend PATCH endpoint for persistence');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
        Tasks
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         {tasks.length === 0 ? (
           <div className="p-8 text-center text-slate-500">No tasks yet. Use the Agent to create one!</div>
         ) : (
           <ul className="divide-y divide-slate-100">
             {tasks.map((task: any) => (
                <li key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggle(task.id, task.status)} className="text-slate-300 hover:text-blue-500 transition-colors">
                      {task.status === 'done' ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div>
                      <p className={`font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                           {task.priority || 'Normal'}
                        </span>
                        {task.deadline && <span className="flex items-center gap-1"><Calendar size={14}/> {task.deadline}</span>}
                      </div>
                    </div>
                  </div>
                </li>
             ))}
           </ul>
         )}
      </div>
    </div>
  );
}
