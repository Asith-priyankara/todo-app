import axios from "axios";
import { config } from "../config/config";
import type {
  RegisterRequest,
  LoginRequest,
  CreateTaskRequest,
  TaskResponse,
} from "../types/api";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterRequest): Promise<string> => {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data || "Email already exists");
      }
      throw new Error("Registration failed. Please try again.");
    }
  },

  login: async (data: LoginRequest): Promise<string> => {
    try {
      const response = await api.post("/auth/login", data);
      const token = response.data;

      localStorage.setItem("token", token);

      return token;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw new Error("Login failed. Please try again.");
    }
  },
};

export const tasksAPI = {
  getTasks: async (): Promise<TaskResponse[]> => {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch tasks. Please try again.");
    }
  },

  createTask: async (data: CreateTaskRequest): Promise<TaskResponse> => {
    try {
      const response = await api.post("/tasks", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to create task. Please try again.");
    }
  },

  completeTask: async (taskId: number): Promise<void> => {
    try {
      await api.put(`/tasks/${taskId}/complete`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      if (error.response?.status === 404) {
        throw new Error("Task not found.");
      }
      throw new Error("Failed to complete task. Please try again.");
    }
  },
};
