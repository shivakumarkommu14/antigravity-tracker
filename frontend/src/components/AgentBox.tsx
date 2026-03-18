"use client";
import { useState } from 'react';
import { agentCommand } from '@/lib/api';
import { Bot, Send, Loader2 } from 'lucide-react';

export default function AgentBox({ onAction }: { onAction: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setMessage("");
    try {
      const res = await agentCommand(prompt);
      setMessage(res.message);
      setPrompt("");
      onAction(); // refresh data
    } catch {
      setMessage("Error parsing command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mt-8 mb-8 backdrop-blur-lg bg-opacity-90">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <Bot className="text-blue-500 w-6 h-6" /> Ask the Agent
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input 
          type="text" 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. 'spent $50 on groceries' or 'urgent meeting tomorrow'"
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-semibold flex items-center justify-center min-w-[120px]">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <div className="flex items-center gap-2">Send <Send size={16}/></div>}
        </button>
      </form>
      {message && <div className="mt-4 text-sm text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2">✨ {message}</div>}
    </div>
  );
}
