'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserDetail } from '@/components/UserDetail';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function UserPage() {
  const { id } = useParams();
  console.log('ID from useParams:', id);

  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch(`/api/posts?userId=${id}`),
        ]);

        if (!userRes.ok) {
          if (mounted) setNotFound(true);
          return;
        }

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        if (mounted) {
          setUser(userData);
          setPosts(postsData);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setNotFound(true);
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (notFound || !user) {
    return <div className="p-8">User not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container px-6 py-8 mx-auto">
            <UserDetail user={user} posts={posts} />
          </div>
        </main>
      </div>
    </div>
  );
}