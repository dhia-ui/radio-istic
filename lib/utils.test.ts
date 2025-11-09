import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2")
    expect(result).toBe("class1 class2")
  })

  it("should handle conditional classes", () => {
    const result = cn("base", true && "truthy", false && "falsy")
    expect(result).toBe("base truthy")
  })

  it("should merge Tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4")
    expect(result).toBe("py-1 px-4")
  })

  it("should handle arrays of classes", () => {
    const result = cn(["class1", "class2"], "class3")
    expect(result).toBe("class1 class2 class3")
  })

  it("should handle undefined and null", () => {
    const result = cn("base", undefined, null, "other")
    expect(result).toBe("base other")
  })

  it("should handle objects with boolean values", () => {
    const result = cn("base", { active: true, disabled: false })
    expect(result).toBe("base active")
  })

  it("should return empty string for no arguments", () => {
    const result = cn()
    expect(result).toBe("")
  })

  it("should deduplicate identical classes", () => {
    const result = cn("text-lg", "text-lg", "font-bold")
    expect(result).toBe("text-lg font-bold")
  })
})
