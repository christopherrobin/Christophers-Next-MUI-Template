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
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '2.5rem',
          fontWeight: 700
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.5
        }
      }
    }
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
