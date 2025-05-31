'use client'
import {
  createTheme,
  ThemeOptions,
  responsiveFontSizes
} from '@mui/material/styles'
import { PaletteOptions } from '@mui/material/styles/createPalette'

const primaryMain = '#20cb91'
const secondaryMain = '#8a92b2'
const bgDark = '#0e1018'
const bgLight = '#131621'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    text: {
      primary: '#ffffff',
      secondary: '#3e435c'
    },
    background: {
      default: bgDark,
      paper: bgLight
    },
    primary: {
      light: 'rgb(76, 213, 167)',
      main: primaryMain,
      dark: 'rgb(22, 142, 101)',
      contrastText: '#0e1018'
    },
    secondary: {
      light: 'rgb(161, 167, 193)',
      main: secondaryMain,
      dark: 'rgb(96, 102, 124)',
      contrastText: '#ededed'
    }
  } as PaletteOptions,
  typography: {
    h1: {
      fontWeight: 900,
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2.6rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 500
    },
    h4: {
      fontSize: '2rem'
    },
    h5: {
      fontSize: '1.6rem'
    },
    h6: {
      fontSize: '1.4rem'
    },
    body1: {
      fontSize: '1.2rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          textTransform: 'none',
          padding: '16px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: bgDark
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          p: 6
        }
      }
    },
    MuiDivider: {
      defaultProps: {
        sx: {
          my: 2
        }
      },
      styleOverrides: {
        root: {
          backgroundColor: bgDark
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
        sx: {
          mb: 4
        }
      }
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: primaryMain
        },
        iconHover: {
          color: primaryMain
        },
        iconEmpty: {
          color: primaryMain
        }
      }
    },
    MuiInputLabel: {
      defaultProps: { shrink: true }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: secondaryMain,
          backgroundColor: bgLight,
          '&.Mui-focused': {
            color: primaryMain
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'color 0.2s ease-in-out',
          '& .MuiListItemIcon-root': {
            transition: 'color 0.2s ease-in-out'
          },
          '&:hover': {
            backgroundColor: 'transparent',
            color: primaryMain,
            '& .MuiListItemIcon-root': {
              color: primaryMain
            }
          }
        }
      }
    }
  }
}

let theme = createTheme(themeOptions)

// Apply responsive typography adjustments
theme = responsiveFontSizes(theme)

export default theme
