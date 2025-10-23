'use client';

import { User } from '@/types/user';
import { Post } from '@/types/post';
import Link from 'next/link';

interface RecentActivityProps {
  users: User[];
  posts: Post[];
}

export function RecentActivity({ users, posts }: RecentActivityProps) {
  // Get recent posts (last 5)
  const recentPosts = posts
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user?.name || 'Unknown User',
        userId: post.userId
      };
    });

  // Get recently active users (users with most recent posts)
  const recentUsers = users
    .map(user => ({
      ...user,
      recentPostCount: posts.filter(p => p.userId === user.id).length,
      latestPost: posts
        .filter(p => p.userId === user.id)
        .sort((a, b) => b.id - a.id)[0]
    }))
    .sort((a, b) => (b.latestPost?.id || 0) - (a.latestPost?.id || 0))
    .slice(0, 5);

  return (
    <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </h3>
        <Link
          href="/users"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <div>
          <h4 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">
            Recent Posts
          </h4>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start p-3 space-x-3 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {post.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                    {post.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    by {post.user}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {post.body.substring(0, 60)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Users */}
        <div>
          <h4 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">
            Most Active Users
          </h4>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center p-3 space-x-3 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full dark:bg-green-900">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/users/${user.id}`}
                    className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {user.name}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {user.recentPostCount} posts • {user.email}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}