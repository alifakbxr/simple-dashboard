import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard if authenticated, otherwise to login
  // This will be handled by middleware, but this provides a fallback
  redirect('/login');
}