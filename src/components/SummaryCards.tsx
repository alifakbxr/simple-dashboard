'use client';

import { User } from '@/types/user';
import { Post } from '@/types/post';
import { Users, FileText, ChartBar, CheckCircle } from 'phosphor-react';

interface SummaryCardsProps {
  users: User[];
  posts: Post[];
}

export function SummaryCards({ users, posts }: SummaryCardsProps) {
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const avgPostsPerUser = totalUsers > 0 ? Math.round(totalPosts / totalUsers) : 0;
  const activeUsers = users.filter(user => user.website).length; // Using website as a proxy for "active"

  const cards = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      description: 'Registered users in the system',
      icon: <Users size={24} weight="fill" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Posts',
      value: totalPosts.toString(),
      description: 'Posts created by all users',
      icon: <FileText size={24} weight="fill" />,
      color: 'bg-green-500',
    },
    {
      title: 'Avg Posts/User',
      value: avgPostsPerUser.toString(),
      description: 'Average posts per user',
      icon: <ChartBar size={24} weight="fill" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      description: 'Users with active profiles',
      icon: <CheckCircle size={24} weight="fill" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {card.title}
              </p>
              <p className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {card.value}
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {card.description}
              </p>
            </div>
            <div className={`flex-shrink-0 p-3 rounded-lg ${card.color} text-white`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}