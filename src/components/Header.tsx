'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignOut, Sun, Moon } from 'phosphor-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Header({ isOpen, setIsOpen }: HeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return (
      <header className="bg-white border-b shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-end h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
              <div className="px-4 py-2 bg-red-600 rounded-lg"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      router.push('/login');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white border-b shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-end h-16">
          {/* Sidebar Toggle Button - Only on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute p-2 transition-colors duration-200 rounded-lg left-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 transition-colors duration-200 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <SignOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}