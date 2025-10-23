'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';

export default function AnalyticsPage() {
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
          <div className="container px-6 py-8 mx-auto">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Analytics Dashboard
              </h1>
              <p className="text-slate-700 dark:text-slate-300">
                Comprehensive insights into user activity, content creation, and system performance
              </p>
            </div>

            {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <AnalyticsCharts users={users} posts={posts} />}
          </div>
        </main>
      </div>
    </div>
  );
}