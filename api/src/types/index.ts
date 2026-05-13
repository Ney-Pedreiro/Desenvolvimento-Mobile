export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
}

export interface JWTPayload extends AuthPayload {
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthPayload;
}

export interface ErrorResponse {
  message: string;
  code: string;
}
