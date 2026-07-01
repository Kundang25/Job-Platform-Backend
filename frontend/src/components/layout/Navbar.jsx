'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Clear auth tokens
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      
      {/* Mobile Logo / Menu Toggle */}
      <div className="flex items-center md:hidden">
        <span className="text-lg font-bold text-blue-600">AutoApply</span>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-lg hidden sm:block ml-4 md:ml-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs, applications..."
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4 ml-4">
        <button className="text-slate-500 hover:text-slate-700 relative">
          🔔
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            KG
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors hidden sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}