'use client';

import { useState, useEffect } from 'react';
import { UserTable } from '@/components/UserTable';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/posts'),
        ]);
        const usersData = await usersRes.json();
        const postsData = await postsRes.json();
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="container px-6 py-8 mx-auto">
            <div className="mb-8">
              <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700">
                <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Users Management</h1>
                <p className="text-slate-700 dark:text-slate-300">
                  Manage and view all users in the system. Click on any user to view detailed information and their posts.
                </p>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700">
              <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  All Users
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="py-2 pl-10 pr-4 bg-white border rounded-lg dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <UserTable users={users} posts={posts} searchQuery={searchQuery} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}