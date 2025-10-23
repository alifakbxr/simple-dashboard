'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Post } from '@/types/post';
import { User } from '@/types/user';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function PostPage() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch(`/api/posts/${id}`);
        if (!postRes.ok) {
          notFound();
        }
        const postData: Post = await postRes.json();
        setPost(postData);

        const userRes = await fetch(`/api/users/${postData.userId}`);
        if (userRes.ok) {
          const userData: User = await userRes.json();
          setUser(userData);
        }
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
            {loading || !post ? (
              <p className="text-slate-700 dark:text-slate-300">Loading...</p>
            ) : (
              <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Post Details</h1>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Title</h3>
                    <p className="text-slate-700 dark:text-slate-300">{post.title}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Body</h3>
                    <p className="text-slate-700 dark:text-slate-300">{post.body}</p>
                  </div>
                  {user && (
                    <>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Author</h3>
                        <p className="text-slate-700 dark:text-slate-300">{user.name} ({user.username})</p>
                        <p className="text-slate-700 dark:text-slate-300">{user.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}