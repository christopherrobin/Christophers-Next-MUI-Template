// src/components/Providers.tsx
'use client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import theme from '../../theme'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
