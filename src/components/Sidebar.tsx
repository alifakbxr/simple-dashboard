'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartBar, Users, ChartLineUp, Article } from 'phosphor-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <ChartBar size={20} weight="fill" />
    },
    {
      name: 'Users',
      href: '/users',
      icon: <Users size={20} weight="fill" />
    },
    {
      name: 'Posts',
      href: '/posts',
      icon: <Article size={20} weight="fill" />
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: <ChartLineUp size={20} weight="fill" />
    },
  ];

  return (
    <>
      {/* Sidebar Backdrop - Only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-300 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Static on laptop and desktop, overlay on mobile */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 md:w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto md:shadow-lg md:border-r ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b bg-blue-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          {/* Close button - Only on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-4 mt-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 dark:border-blue-400'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}