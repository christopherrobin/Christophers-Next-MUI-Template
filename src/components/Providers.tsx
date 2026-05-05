// src/components/Providers.tsx
'use client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import theme from '../../theme'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  )
}
