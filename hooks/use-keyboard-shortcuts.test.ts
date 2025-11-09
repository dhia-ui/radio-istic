import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any event listeners
    const listeners = (window as any)._eventListeners?.keydown || []
    listeners.forEach((listener: any) => {
      window.removeEventListener("keydown", listener)
    })
  })

  it("should handle Cmd/Ctrl + K for search", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    
    renderHook(() => useKeyboardShortcuts())

    // Simulate Cmd+K on Mac
    const eventMac = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    })
    window.dispatchEvent(eventMac)

    expect(consoleSpy).toHaveBeenCalledWith("Open search...")

    consoleSpy.mockRestore()
  })

  it("should handle Cmd/Ctrl + / for chat toggle", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    
    renderHook(() => useKeyboardShortcuts())

    // Simulate Cmd+/ on Mac
    const eventMac = new KeyboardEvent("keydown", {
      key: "/",
      metaKey: true,
      bubbles: true,
    })
    window.dispatchEvent(eventMac)

    expect(consoleSpy).toHaveBeenCalledWith("Toggle chat...")

    consoleSpy.mockRestore()
  })

  it("should handle Escape key", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    
    renderHook(() => useKeyboardShortcuts())

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    })
    window.dispatchEvent(event)

    expect(consoleSpy).toHaveBeenCalledWith("Escape pressed...")

    consoleSpy.mockRestore()
  })

  it("should preventDefault for handled shortcuts", () => {
    renderHook(() => useKeyboardShortcuts())

    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    })
    const preventDefaultSpy = vi.spyOn(event, "preventDefault")
    
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener")
    
    const { unmount } = renderHook(() => useKeyboardShortcuts())
    
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function))
  })

  it("should support both metaKey and ctrlKey", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    
    renderHook(() => useKeyboardShortcuts())

    // Test with Ctrl (Windows/Linux)
    const eventCtrl = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
    })
    window.dispatchEvent(eventCtrl)

    expect(consoleSpy).toHaveBeenCalledWith("Open search...")

    consoleSpy.mockRestore()
  })

  it("should not trigger on regular key presses", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    
    renderHook(() => useKeyboardShortcuts())

    // Regular 'k' without modifier
    const event = new KeyboardEvent("keydown", {
      key: "k",
      bubbles: true,
    })
    window.dispatchEvent(event)

    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
