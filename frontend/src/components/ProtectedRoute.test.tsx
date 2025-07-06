import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(await import("@/contexts/AuthContext")).useAuth;

const renderProtectedRoute = (
  children: React.ReactNode,
  initialEntries = ["/protected"]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  it("shows loading spinner when authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute(<div>Protected Content</div>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

   
    renderProtectedRoute(<div>Protected Content</div>);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        email: "test@example.com",
        fullName: "Test User",
        token: "test-token",
      },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute(<div>Protected Content</div>);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders complex children correctly", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        email: "test@example.com",
        fullName: "Test User",
        token: "test-token",
      },
      login: vi.fn(),
      logout: vi.fn(),
    });

    const complexChildren = (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the protected area</p>
        <button>Action Button</button>
      </div>
    );

    renderProtectedRoute(complexChildren);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to the protected area")
    ).toBeInTheDocument();
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });
});
