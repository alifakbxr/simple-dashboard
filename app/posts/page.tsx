'use client';

import { useState, useEffect } from 'react';
import { PostList } from '@/components/PostList';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function PostsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await fetch('/api/posts');
        const postsData = await postsRes.json();
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
              <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700">
                <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Posts Management</h1>
                <p className="text-slate-700 dark:text-slate-300">
                  View all posts in the system. Click on any post to view detailed information.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 dark:shadow-slate-900/50 rounded-xl border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  All Posts
                </h2>
              </div>
              {loading ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <PostList posts={posts} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}