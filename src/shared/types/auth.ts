export enum UserRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  CLIENT = 'CLIENT',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
