import { CssBaseline, ThemeProvider } from '@mui/material'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'

import theme from '@/theme'

interface ProvidersProps {
  children: ReactNode
}

function AllProviders({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

/**
 * Renders a component inside the MUI ThemeProvider + CssBaseline shell
 * used by the app, so component tests see the real theme tokens.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

/** Thin re-export of `userEvent.setup()` for consistency across test files. */
export function setupUser() {
  return userEvent.setup()
}

export * from '@testing-library/react'
