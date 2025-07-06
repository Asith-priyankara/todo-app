import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges classes correctly", () => {
      const result = cn("bg-red-500", "text-white");
      expect(result).toBe("bg-red-500 text-white");
    });

    it("handles conflicting Tailwind classes", () => {
      const result = cn("bg-red-500", "bg-blue-500");
      expect(result).toBe("bg-blue-500");
    });

    it("handles conditional classes", () => {
      const result = cn(
        "base-class",
        true && "conditional-class",
        false && "hidden-class"
      );
      expect(result).toBe("base-class conditional-class");
    });

    it("handles arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("handles objects with boolean values", () => {
      const result = cn({
        "always-present": true,
        conditional: true,
        "never-present": false,
      });
      expect(result).toBe("always-present conditional");
    });

    it("handles empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("handles undefined and null inputs", () => {
      const result = cn("valid-class", undefined, null, "another-class");
      expect(result).toBe("valid-class another-class");
    });

    it("handles complex Tailwind merging scenarios", () => {
      const result = cn("px-4 py-2", "px-6"); 
      expect(result).toBe("py-2 px-6");
    });

    it("handles responsive prefixes correctly", () => {
      const result = cn("text-sm md:text-base", "md:text-lg");
      expect(result).toBe("text-sm md:text-lg");
    });
  });
});
