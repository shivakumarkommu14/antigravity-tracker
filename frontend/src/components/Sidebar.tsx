import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, DollarSign, HandCoins, LogOut } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen p-5 flex flex-col justify-between shadow-2xl">
      <div>
        <div className="text-2xl font-black px-2 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
          Antigravity
        </div>
        <nav className="flex flex-col gap-2 font-medium">
          <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-600/20 hover:text-blue-400 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/tasks" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-green-600/20 hover:text-green-400 transition-all">
            <CheckSquare size={20} /> Tasks
          </Link>
          <Link href="/finance" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-yellow-600/20 hover:text-yellow-400 transition-all">
            <DollarSign size={20} /> Finance
          </Link>
          <Link href="/loans" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-purple-600/20 hover:text-purple-400 transition-all">
            <HandCoins size={20} /> Loans
          </Link>
        </nav>
      </div>
      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-rose-600/20 hover:text-rose-400 transition-all font-semibold text-slate-400 w-full">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
