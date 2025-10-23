'use client';

import { useState, useEffect } from 'react';
import { UserTable } from '@/components/UserTable';
import { SummaryCards } from '@/components/SummaryCards';
import { RecentActivity } from '@/components/RecentActivity';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 py-6 mx-auto sm:px-6 md:px-8 md:py-8">
            {/* Welcome Section */}
            <div className="mb-8 md:mb-12">
              <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700 md:p-8">
                <h1 className="mb-3 text-2xl font-bold md:text-4xl text-slate-900 dark:text-slate-100">
                  Welcome to Dashboard
                </h1>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Overview of your system activity and user management
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 md:mb-12">
              {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <SummaryCards users={users} posts={posts} />}
            </div>

            {/* Recent Activity - Full Width */}
            <div className="mb-8">
              {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <RecentActivity users={users} posts={posts} />}
            </div>

            {/* Users Table */}
            <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700 md:p-8">
              <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  All Users
                </h2>
                <Link
                  href="/users"
                  className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View All Users
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <UserTable users={users} posts={posts} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}