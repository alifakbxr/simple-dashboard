'use client';

import { useState, useEffect } from 'react';
import { UserTable } from '@/components/UserTable';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

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
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">
                  Overview of your system data and user activity.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {loading ? <p>Loading...</p> : <UserTable users={users} posts={posts} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}