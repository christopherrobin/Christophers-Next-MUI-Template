'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedMode = 'light' | 'dark'

export const STORAGE_KEY = 'mui-mode'

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

function readStoredMode(): ThemeMode {
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

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system')
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>('dark')
  const [mounted, setMounted] = useState(false)

  // Initial sync after mount: hydrate from localStorage + system pref.
  useEffect(() => {
    const stored = readStoredMode()
    setModeState(stored)
    setResolvedMode(stored === 'system' ? readSystemPref() : stored)
    setMounted(true)
  }, [])

  // Follow system pref live when mode === 'system'.
  useEffect(() => {
    if (mode !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) =>
      setResolvedMode(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [mode])

  // Reflect resolved mode on <html> so globals.css and user CSS can react.
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle('dark', resolvedMode === 'dark')
    root.classList.toggle('light', resolvedMode === 'light')
  }, [resolvedMode, mounted])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    writeStoredMode(next)
    setResolvedMode(next === 'system' ? readSystemPref() : next)
  }, [])

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode, mounted }),
    [mode, resolvedMode, setMode, mounted]
  )

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext)
  if (!ctx) {
    throw new Error('useColorScheme must be used inside ColorSchemeProvider')
  }
  return ctx
}
