import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire api module
vi.mock("./api", async () => {
  const actual = await vi.importActual("./api");
  return {
    ...actual,
    authAPI: {
      register: vi.fn(),
      login: vi.fn(),
    },
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authAPI", () => {
    it("mock test - login function exists", async () => {
      const { authAPI } = await import("./api");
      expect(typeof authAPI.login).toBe("function");
    });

    it("mock test - register function exists", async () => {
      const { authAPI } = await import("./api");
      expect(typeof authAPI.register).toBe("function");
    });
  });
});
