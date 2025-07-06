import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with default styling", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex", "h-10", "w-full", "rounded-md", "border");
  });

  it("handles different input types", () => {
    const { rerender } = render(<Input type="password" data-testid="input" />);

    let input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="email" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="number" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("handles onChange events", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input onChange={handleChange} placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "a");

    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });

  it("accepts all standard input props", () => {
    render(
      <Input
        id="test-input"
        name="testName"
        value="test value"
        maxLength={10}
        readOnly
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveAttribute("name", "testName");
    expect(input).toHaveValue("test value");
    expect(input).toHaveAttribute("maxLength", "10");
    expect(input).toHaveAttribute("readonly");
  });
});
