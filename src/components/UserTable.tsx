'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { User } from '@/types/user';
import { Post } from '@/types/post';

interface UserTableProps {
  users: User[];
  posts: Post[];
  searchQuery?: string;
}

type SortField = 'name' | 'email' | 'username';
type SortOrder = 'asc' | 'desc';

export function UserTable({ users, posts, searchQuery = '' }: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Associate posts with users
  const usersWithPosts = useMemo(() => {
    return users.map(user => ({
      ...user,
      postCount: posts.filter(post => post.userId === user.id).length,
    }));
  }, [users, posts]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return usersWithPosts;
    return usersWithPosts.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersWithPosts, searchQuery]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredUsers, sortField, sortOrder]);

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };


  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortField === 'name' && (
                    <span className="text-blue-600 dark:text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => handleSort('username')}>
                <div className="flex items-center space-x-1">
                  <span>Username</span>
                  {sortField === 'username' && (
                    <span className="text-blue-600 dark:text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => handleSort('email')}>
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {sortField === 'email' && (
                    <span className="text-blue-600 dark:text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-600 dark:text-slate-300">
                Posts
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-600 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900 dark:text-slate-100">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {user.username}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {user.postCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <Link
                    href={`/users/${user.id}`}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium transition-colors border rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium transition-colors border rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}