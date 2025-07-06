import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { authAPI, tasksAPI } from "@/services/api";

vi.mock("@/services/api", () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
  },
  tasksAPI: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    vi.mocked(tasksAPI.getTasks).mockResolvedValue([]);
  });

  it("renders login page by default when not authenticated", () => {
    render(<App />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to access your task manager")
    ).toBeInTheDocument();
  });

  it("redirects to tasks page after successful login", async () => {
    const user = userEvent.setup();
    const mockToken = "test-token";

    vi.mocked(authAPI.login).mockResolvedValue(mockToken);

    render(<App />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("Welcome Back")).not.toBeInTheDocument();
    });
  });

  it("shows register page when clicking register link", async () => {
    const user = userEvent.setup();

    render(<App />);

    const registerLink = screen.getByRole("link", { name: /create one here/i });
    await user.click(registerLink);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Create Account" })
      ).toBeInTheDocument();
    });
  });

  it("restores authentication from localStorage", () => {
    const mockUser = { email: "test@example.com", fullName: "Test User" };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "token") return "stored-token";
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    });

    render(<App />);

    expect(screen.queryByText("Welcome Back")).not.toBeInTheDocument();
  });

  it("handles authentication errors gracefully", async () => {
    const user = userEvent.setup();

    vi.mocked(authAPI.login).mockRejectedValue(
      new Error("Invalid credentials")
    );

    render(<App />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  it("handles navigation between authenticated and unauthenticated routes", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();

    const registerLink = screen.getByRole("link", { name: /create one here/i });
    await user.click(registerLink);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Create Account" })
      ).toBeInTheDocument();
    });

    const loginLink = screen.getByRole("link", { name: /sign in/i });
    await user.click(loginLink);

    await waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });
  });
});
