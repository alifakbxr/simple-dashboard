import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { LoginRequest, LoginResponse, JWTPayload, RefreshTokenPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Mock user database - in production, this would be a real database
const MOCK_USERS = [
  {
    id: 1,
    name: 'Demo User',
    username: 'testuser',
    password: 'testpass',
    email: 'test@example.com',
    phone: '+1234567890',
    website: 'demo.com',
    company: {
      name: 'Demo Company',
      catchPhrase: 'Demo catch phrase',
      bs: 'Demo bs'
    },
    address: {
      street: 'Demo Street',
      suite: 'Suite 100',
      city: 'Demo City',
      zipcode: '12345',
      geo: {
        lat: '0',
        lng: '0'
      }
    }
  }
];

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user (mock authentication)
    const user = MOCK_USERS.find(u => u.username === username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokenId = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    // Access token payload (without exp - let jwt.sign handle it)
    const tokenPayload: Omit<JWTPayload, 'exp' | 'iat'> = {
      userId: user.id,
      username: user.username
    };

    // Refresh token payload (without exp - let jwt.sign handle it)
    const refreshTokenPayload: Omit<RefreshTokenPayload, 'exp' | 'iat'> = {
      userId: user.id,
      tokenId
    };

    // Sign tokens
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET, { expiresIn: '7d' });

    // Create response
    const response: LoginResponse = {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        company: user.company,
        address: user.address
      }
    };

    // Set cookies with environment-aware security
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: 'strict' as const,
      maxAge: 3600, // 1 hour
      path: '/'
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      maxAge: 604800 // 7 days
    };

    const nextResponse = NextResponse.json(response);

    // Set access token cookie
    nextResponse.cookies.set('auth-token', token, cookieOptions);

    // Set refresh token cookie
    nextResponse.cookies.set('refresh-token', refreshToken, refreshCookieOptions);

    return nextResponse;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}