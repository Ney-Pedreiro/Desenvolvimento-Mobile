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

export interface Device {
  id: string;
  name: string;
  location: string;
  type: string;
  temperature: number;
  humidity?: number;
  status: 'online' | 'offline';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeviceRequest {
  name: string;
  location: string;
  type: string;
  temperature?: number;
  humidity?: number;
}

export interface UpdateDeviceRequest {
  name?: string;
  location?: string;
  type?: string;
  temperature?: number;
  humidity?: number;
  status?: 'online' | 'offline';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}
