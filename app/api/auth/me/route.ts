import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };

      // In a real app, fetch user from database using decoded.userId
      // For demo, return mock user data
      const user: User = {
        id: typeof decoded.userId === 'number' ? decoded.userId : parseInt(decoded.userId) || 1,
        name: 'Demo User',
        username: decoded.username || 'demouser',
        email: 'demo@example.com',
        address: {
          street: 'Demo Street',
          suite: 'Suite 100',
          city: 'Demo City',
          zipcode: '12345',
          geo: { lat: '0', lng: '0' }
        },
        phone: '+1234567890',
        website: 'demo.com',
        company: {
          name: 'Demo Company',
          catchPhrase: 'Demo catch phrase',
          bs: 'Demo bs'
        }
      };

      return NextResponse.json({ user });

    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}