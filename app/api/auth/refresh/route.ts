import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload, RefreshTokenPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decodedRefreshToken: RefreshTokenPayload;
    try {
      decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET) as RefreshTokenPayload;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Check if refresh token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decodedRefreshToken.exp < now) {
      return NextResponse.json(
        { success: false, error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newTokenPayload: Omit<JWTPayload, 'exp' | 'iat'> = {
      userId: decodedRefreshToken.userId,
      username: '' // We don't have username in refresh token, but it's okay for now
    };

    const newToken = jwt.sign(newTokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      token: newToken,
      message: 'Token refreshed successfully'
    });

    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}