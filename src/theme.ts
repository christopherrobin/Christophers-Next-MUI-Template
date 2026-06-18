'use client'
import {
  createTheme,
  responsiveFontSizes,
  type ThemeOptions
} from '@mui/material/styles'

const primaryMain = '#20cb91'
// Darkened brand green for light mode: the bright #20cb91 only hits ~2.1:1
// against white text, so light surfaces use this deeper shade to keep white
// button text/icons at WCAG AA.
const primaryLightMode = 'rgb(22, 142, 101)'
const secondaryMain = '#8a92b2'
const bgDarkDefault = '#0e1018'
const bgDarkPaper = '#131621'

// Shared options across both schemes (typography + component overrides
// that don't depend on palette).
const sharedOptions: ThemeOptions = {
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h1: { fontWeight: 900, fontSize: '3rem' },
    h2: { fontSize: '2.6rem', fontWeight: 700 },
    h3: { fontSize: '2.2rem', fontWeight: 500 },
    h4: { fontSize: '2rem' },
    h5: { fontSize: '1.6rem' },
    h6: { fontSize: '1.4rem' },
    body1: { fontSize: '1.2rem' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { fontWeight: 900, textTransform: 'none', padding: '16px' }
      }
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'xl' }
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: { color: primaryMain },
        iconHover: { color: primaryMain },
        iconEmpty: { color: primaryMain }
      }
    },
    MuiInputLabel: {
      // Permanently shrunk above the field — opinionated for outlined-variant
      // forms in this starter. If forking and you want the floating-label
      // animation back, drop this default.
      defaultProps: { shrink: true }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'color 0.2s ease-in-out',
          '& .MuiListItemIcon-root': {
            transition: 'color 0.2s ease-in-out'
          },
          '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.main
            }
          }
        })
      }
    }
  }
}

const darkOptions: ThemeOptions = {
  ...sharedOptions,
  palette: {
    mode: 'dark',
    text: { primary: '#ffffff', secondary: '#a8b1c8' },
    background: { default: bgDarkDefault, paper: bgDarkPaper },
    primary: {
      light: 'rgb(76, 213, 167)',
      main: primaryMain,
      dark: 'rgb(22, 142, 101)',
      // Dark text on the bright brand green — required for WCAG AA
      // contrast on contained buttons (white on #20cb91 is ~2.1:1).
      contrastText: bgDarkDefault
    },
    secondary: {
      light: 'rgb(161, 167, 193)',
      main: secondaryMain,
      dark: 'rgb(96, 102, 124)',
      contrastText: '#ededed'
    }
  },
  components: {
    ...sharedOptions.components,
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: bgDarkPaper } }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          backgroundColor: bgDarkPaper,
          '&.Mui-focused': { color: theme.palette.primary.main }
        })
      }
    }
  }
}

const lightOptions: ThemeOptions = {
  ...sharedOptions,
  palette: {
    mode: 'light',
    primary: {
      light: primaryMain,
      main: primaryLightMode,
      dark: 'rgb(16, 110, 78)',
      // White text on the darkened green clears WCAG AA on light surfaces.
      contrastText: '#ffffff'
    },
    secondary: {
      light: 'rgb(161, 167, 193)',
      main: secondaryMain,
      dark: 'rgb(96, 102, 124)',
      contrastText: '#ffffff'
    }
  },
  components: {
    ...sharedOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper
        })
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.paper,
          '&.Mui-focused': { color: theme.palette.primary.main }
        })
      }
    }
  }
}

export const themeLight = responsiveFontSizes(createTheme(lightOptions))
export const themeDark = responsiveFontSizes(createTheme(darkOptions))

// Default export remains the dark theme so any code that imports the
// default keeps the original behaviour while we add light-mode support.
export default themeDark
