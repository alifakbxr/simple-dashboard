import { User } from '@/types/user';
import { Post } from '@/types/post';
import { PostList } from './PostList';

interface UserDetailProps {
  user: User;
  posts: Post[];
}

export function UserDetail({ user, posts }: UserDetailProps) {
  return (
    <div>
      <div className="p-6 bg-white border shadow-sm dark:bg-slate-800 rounded-xl dark:shadow-slate-900/50 border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Details</h1>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Name</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.name}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Username</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.username}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Email</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.email}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Phone</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.phone}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Website</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.website}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Company</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.company.name}</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Address</h3>
            <p className="text-slate-700 dark:text-slate-300">{user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
          </div>
        </div>
      </div>

      <PostList posts={posts} />
    </div>
  );
}