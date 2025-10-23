'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { UserDetail } from '@/components/UserDetail';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function UserPage() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch(`/api/posts?userId=${id}`),
        ]);

        if (!userRes.ok) {
          notFound();
        }

        const userData = await userRes.json();
        const postsData = await postsRes.json();
        setUser(userData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="container px-6 py-8 mx-auto">
            {loading || !user ? <p className="text-slate-700 dark:text-slate-300">Loading...</p> : <UserDetail user={user} posts={posts} />}
          </div>
        </main>
      </div>
    </div>
  );
}