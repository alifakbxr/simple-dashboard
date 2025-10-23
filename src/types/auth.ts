export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
  };
  error?: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
  iat: number;
  exp: number;
}