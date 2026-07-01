'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Resume AI', href: '/resume', icon: '📄' },
    { name: 'Find Jobs', href: '/jobs', icon: '🔍' },
    { name: 'Applications', href: '/applications', icon: '📋' },
    { name: 'AI Tools', href: '/ai', icon: '✨' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed top-0 left-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="text-xl font-bold text-blue-400">
          AutoApply AI
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link 
          href="/admin" 
          className="flex items-center px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span>⚙️ Admin Panel</span>
        </Link>
      </div>
    </div>
  );
}