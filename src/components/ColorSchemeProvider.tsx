'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode
} from 'react'

import { useHydrated } from '@/hooks/useHydrated'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedMode = 'light' | 'dark'

export const STORAGE_KEY = 'mui-mode'
// Custom event so setMode() can notify subscribers in the same tab —
// the native `storage` event only fires across tabs.
const CHANGE_EVENT = 'mui-mode-change'

type Snapshot = { mode: ThemeMode; resolvedMode: ResolvedMode }

type ColorSchemeContextValue = {
  mode: ThemeMode
  resolvedMode: ResolvedMode
  setMode: (mode: ThemeMode) => void
  mounted: boolean
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null)

function readSystemPref(): ResolvedMode {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// In-memory override used when localStorage writes are blocked
// (private mode, quota exceeded). Without this, setMode() would have
// no effect on the UI because getSnapshot() re-reads from localStorage.
// Cleared by the cross-tab storage event so external updates win.
let inMemoryMode: ThemeMode | null = null

function readStoredMode(): ThemeMode {
  if (inMemoryMode !== null) return inMemoryMode
  if (typeof window === 'undefined') return 'system'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // localStorage may be disabled (private mode, restricted SES).
  }
  return 'system'
}

function writeStoredMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Mirror the boot script's catch — a write failure shouldn't crash
    // the click handler.
  }
}

// External store backing the snapshot. Cached so useSyncExternalStore
// gets a stable reference between renders when the underlying mode
// hasn't changed (otherwise React would treat every getSnapshot() as a
// state change and infinite-loop).
let cachedSnapshot: Snapshot | null = null

function getSnapshot(): Snapshot {
  const mode = readStoredMode()
  const resolvedMode = mode === 'system' ? readSystemPref() : mode
  if (
    cachedSnapshot &&
    cachedSnapshot.mode === mode &&
    cachedSnapshot.resolvedMode === resolvedMode
  ) {
    return cachedSnapshot
  }
  cachedSnapshot = { mode, resolvedMode }
  return cachedSnapshot
}

// Must match the inline boot script's first-paint default exactly to
// avoid a hydration class flip. Boot script falls back to 'system' →
// resolves to dark when matchMedia is unavailable.
const SERVER_SNAPSHOT: Snapshot = { mode: 'system', resolvedMode: 'dark' }
function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT
}

function invalidate(): void {
  cachedSnapshot = null
}

/**
 * Test-only helper. Resets the module-scope in-memory override and
 * cached snapshot so tests don't bleed state across `beforeEach`.
 *
 * @remarks
 * Production code should never call this. Lives in this module (rather
 * than a separate test file) because the state it resets is
 * file-private.
 */
export function __resetColorSchemeForTest(): void {
  inMemoryMode = null
  cachedSnapshot = null
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    invalidate()
    callback()
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      // External tab wrote the canonical value — drop our in-memory
      // override so its update wins.
      inMemoryMode = null
      onChange()
    }
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  mql.addEventListener('change', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
    mql.removeEventListener('change', onChange)
  }
}

/**
 * Provides the active theme mode (`'system' | 'light' | 'dark'`) and
 * the resolved binary mode (`'light' | 'dark'`) to descendants via
 * context.
 *
 * @remarks
 * Backed by a module-scope external store over `localStorage` and
 * `matchMedia` via {@link useSyncExternalStore}, so snapshot
 * transitions land as part of hydration. Pair with the inline boot
 * script in `layout.tsx` that sets the initial `<html>` class before
 * React mounts — that's what prevents a theme flash on first paint.
 */
export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const mounted = useHydrated()

  // Reflect resolved mode on <html> so globals.css and user CSS can
  // react. Gated on `mounted` so we don't fight the inline boot script
  // during the first paint — it already applied the correct class.
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle('dark', snapshot.resolvedMode === 'dark')
    root.classList.toggle('light', snapshot.resolvedMode === 'light')
  }, [snapshot.resolvedMode, mounted])

  const setMode = useCallback((next: ThemeMode) => {
    inMemoryMode = next
    writeStoredMode(next)
    invalidate()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(CHANGE_EVENT))
    }
  }, [])

  const value = useMemo<ColorSchemeContextValue>(
    () => ({
      mode: snapshot.mode,
      resolvedMode: snapshot.resolvedMode,
      setMode,
      mounted
    }),
    [snapshot.mode, snapshot.resolvedMode, setMode, mounted]
  )

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

/**
 * Returns the current color-scheme context. Throws if called outside a
 * {@link ColorSchemeProvider}.
 */
export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext)
  if (!ctx) {
    throw new Error('useColorScheme must be used inside ColorSchemeProvider')
  }
  return ctx
}
