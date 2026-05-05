import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'node:util'

// jsdom 30 lacks TextEncoder/TextDecoder in some module-load paths;
// the `pg` driver (pulled in via @prisma/adapter-pg) needs them at
// require time for its SCRAM auth utilities. Polyfill before any
// import chain reaches pg's webcrypto utils.
if (!('TextEncoder' in globalThis)) {
  ;(globalThis as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder =
    TextEncoder
}
if (!('TextDecoder' in globalThis)) {
  ;(globalThis as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
    TextDecoder
}

if (typeof window !== 'undefined') {
  // matchMedia mock — MUI-specific (used by useMediaQuery and CircularProgress
  // responsive logic). Tailwind sibling repo does not need this.
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      })
    })
  }

  window.scrollTo = jest.fn() as typeof window.scrollTo
}

class MockIntersectionObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  takeRecords = jest.fn(() => [])
  root = null
  rootMargin = ''
  thresholds = []
}

;(
  globalThis as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = MockIntersectionObserver
