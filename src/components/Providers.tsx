// src/components/Providers.tsx
'use client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#9c27b0'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
})

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
