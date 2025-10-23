import { NextResponse } from 'next/server';
import { Post } from '@/types/post';

export async function GET() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts: Post[] = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}