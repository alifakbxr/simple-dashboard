import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types/user';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user: User = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
