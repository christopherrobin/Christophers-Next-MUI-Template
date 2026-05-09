// src/components/Providers.tsx
'use client'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import { ColorSchemeProvider, useColorScheme } from './ColorSchemeProvider'

import { themeDark, themeLight } from '@/theme'

function ThemedTree({ children }: { children: ReactNode }) {
  const { resolvedMode } = useColorScheme()
  const theme = resolvedMode === 'light' ? themeLight : themeDark
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
        <ColorSchemeProvider>
          <ThemedTree>{children}</ThemedTree>
        </ColorSchemeProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  )
}
