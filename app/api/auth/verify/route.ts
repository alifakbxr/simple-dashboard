import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Check if token is expired (additional safety check)
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return NextResponse.json({ valid: false, error: 'Token expired' }, { status: 401 });
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: decoded.userId,
          username: decoded.username
        }
      });

    } catch (error) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
}