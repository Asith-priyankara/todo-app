import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { authAPI } from "@/services/api";
import { AuthProvider } from "@/contexts/AuthContext";

vi.mock("@/services/api", () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: "/login" }),
  };
});

const renderLoginPage = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form elements", () => {
    renderLoginPage();

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to access your task manager")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("validates email field", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const form = document.querySelector("form")!;
    const emailInput = screen.getByPlaceholderText("Enter your email");

    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("validates password field", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const emailInput = screen.getByPlaceholderText("Enter your email");

    emailInput.removeAttribute("required");
    passwordInput.removeAttribute("required");

    await user.type(emailInput, "test@example.com");

    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    await user.type(passwordInput, "123");
    await user.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    const user = userEvent.setup();
    const mockToken = "test-token";

    vi.mocked(authAPI.login).mockResolvedValue(mockToken);

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  it("handles login failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid credentials";

    vi.mocked(authAPI.login).mockRejectedValue(new Error(errorMessage));

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows loading state during login", async () => {
    const user = userEvent.setup();

    vi.mocked(authAPI.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("token"), 1000))
    );

    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it("clears errors when form is resubmitted", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const form = document.querySelector("form")!;
    const emailInput = screen.getByPlaceholderText("Enter your email");

    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    await user.type(emailInput, "test@example.com");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    });
  });

  it("handles input changes correctly", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
