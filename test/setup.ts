import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: any) => {
    return props
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any

// Polyfill Pointer Events capture (used by Radix Slider in jsdom)
if (!(HTMLElement.prototype as any).setPointerCapture) {
  (HTMLElement.prototype as any).setPointerCapture = () => {}
}
if (!(HTMLElement.prototype as any).releasePointerCapture) {
  (HTMLElement.prototype as any).releasePointerCapture = () => {}
}
if (!(HTMLElement.prototype as any).hasPointerCapture) {
  (HTMLElement.prototype as any).hasPointerCapture = () => false
}

// Mock Socket.io client
vi.mock("socket.io-client", () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
}))

// Mock AudioContext for waveform tests
global.AudioContext = class AudioContext {
  decodeAudioData() {
    return Promise.resolve({
      numberOfChannels: 2,
      length: 44100,
      sampleRate: 44100,
      duration: 1,
      getChannelData: () => new Float32Array(44100),
    })
  }
  close() {
    return Promise.resolve()
  }
} as any

// HTMLMediaElement play/pause polyfill for jsdom to avoid unimplemented errors
if (!(global as any).HTMLMediaElement) {
  ;(global as any).HTMLMediaElement = class HTMLMediaElement extends (window as any).HTMLElement {}
}

if (!(HTMLMediaElement.prototype as any).play) {
  ;(HTMLMediaElement.prototype as any).play = vi.fn(() => Promise.resolve())
}
if (!(HTMLMediaElement.prototype as any).pause) {
  ;(HTMLMediaElement.prototype as any).pause = vi.fn(() => {})
}

// Stub fetch for relative audio URLs in tests to prevent invalid URL errors
const originalFetch = global.fetch
global.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    const urlString = typeof input === 'string' ? input : (input as any).toString()
    if (typeof urlString === 'string' && urlString.startsWith('/audio/')) {
      // Return minimal ArrayBuffer for decode simulation
      return Promise.resolve(new Response(new ArrayBuffer(1024), { status: 206 }))
    }
  } catch {}
  return originalFetch(input as any, init)
}
