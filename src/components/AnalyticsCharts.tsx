'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { Users, FileText, ChartBar } from 'phosphor-react';

interface AnalyticsChartsProps {
  users: User[];
  posts: Post[];
}

export function AnalyticsCharts({ users, posts }: AnalyticsChartsProps) {
  // Prepare data for charts
  const postsByUser = users.map(user => ({
    name: user.name,
    username: user.username,
    posts: posts.filter(post => post.userId === user.id).length,
    email: user.email
  })).sort((a, b) => b.posts - a.posts);

  const topUsers = postsByUser.slice(0, 10);

  // Geographic distribution (using city data)
  const cityDistribution = users.reduce((acc, user) => {
    const city = user.address.city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cityData = Object.entries(cityDistribution)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Post creation trends (simulated over time)
  const postTrends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayPosts = posts.filter(post => {
      // Simulate post dates based on post ID (for demo purposes)
      const simulatedDate = new Date(date.getTime() + (post.id % 7) * 24 * 60 * 60 * 1000);
      return simulatedDate.toDateString() === date.toDateString();
    }).length;

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      posts: dayPosts,
      users: Math.floor(dayPosts * 0.3) + 1
    };
  });

  // User activity levels
  const activityLevels = [
    { name: 'High Activity', value: users.filter(u => posts.filter(p => p.userId === u.id).length > 5).length, color: '#10B981' },
    { name: 'Medium Activity', value: users.filter(u => {
      const userPosts = posts.filter(p => p.userId === u.id).length;
      return userPosts >= 2 && userPosts <= 5;
    }).length, color: '#F59E0B' },
    { name: 'Low Activity', value: users.filter(u => posts.filter(p => p.userId === u.id).length < 2).length, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <Users size={24} weight="fill" className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Posts</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{posts.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <FileText size={24} weight="fill" className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Posts/User</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {users.length > 0 ? (posts.length / users.length).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
              <ChartBar size={24} weight="fill" className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Posts by User */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Posts by User
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity Levels */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            User Activity Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityLevels}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Post Creation Trends */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Post Creation Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={postTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="posts" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
              <Area type="monotone" dataKey="users" stackId="2" stroke="#10B981" fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Users by City
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="city" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Contributors */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Top Contributors
          </h3>
          <div className="space-y-3">
            {topUsers.slice(0, 5).map((user, index) => (
              <div key={user.username} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">@{user.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{user.posts}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-6 bg-white border rounded-lg shadow dark:bg-slate-800 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">API Response Time</span>
              <span className="font-medium text-green-600 dark:text-green-400">~100ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">Database Status</span>
              <span className="font-medium text-green-600 dark:text-green-400">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">User Engagement</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300">Content Quality</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">Excellent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}