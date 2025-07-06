import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import type { User } from "@/types/api";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : "null"}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{isLoading.toString()}</div>
      <button
        data-testid="login-btn"
        onClick={() =>
          login("test-token", {
            email: "test@example.com",
            fullName: "Test User",
          })
        }
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it("provides initial state when no stored auth data", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
  });

  it("restores user from localStorage on initialization", () => {
    const mockUser = { email: "stored@example.com", fullName: "Stored User" };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "token") return "stored-token";
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const expectedUser: User = { ...mockUser, token: "stored-token" };
    expect(screen.getByTestId("user")).toHaveTextContent(
      JSON.stringify(expectedUser)
    );
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
  });

  it("handles corrupted localStorage data gracefully", () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "token") return "token";
      if (key === "user") return "invalid-json";
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
  });

  it("handles login correctly", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId("login-btn").click();
    });

    const expectedUser: User = {
      email: "test@example.com",
      fullName: "Test User",
      token: "test-token",
    };

    expect(screen.getByTestId("user")).toHaveTextContent(
      JSON.stringify(expectedUser)
    );
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "token",
      "test-token"
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ email: "test@example.com", fullName: "Test User" })
    );
  });

  it("handles logout correctly", () => {
    const mockUser = { email: "test@example.com", fullName: "Test User" };
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "token") return "test-token";
      if (key === "user") return JSON.stringify(mockUser);
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");

    act(() => {
      screen.getByTestId("logout-btn").click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
  });

  it("throws error when useAuth is used outside of AuthProvider", () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuth must be used within an AuthProvider");

    console.error = originalError;
  });
});
