import Link from 'next/link';
import { Post } from '@/types/post';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              <Link href={`/posts/${post.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}