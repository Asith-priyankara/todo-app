export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface LoginResponse {
  token: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  email: string;
  fullName: string;
  token: string;
}
