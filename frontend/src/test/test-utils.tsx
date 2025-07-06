import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AuthProvider } from "@/contexts/AuthContext";

// Custom render function that includes common providers (without Router)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";
export { customRender as render };
