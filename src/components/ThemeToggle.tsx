'use client'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { type MouseEvent } from 'react'

import { useColorScheme, type ThemeMode } from './ColorSchemeProvider'

const OPTIONS: ReadonlyArray<{
  value: ThemeMode
  label: string
  Icon: typeof SettingsBrightnessIcon
}> = [
  { value: 'system', label: 'System', Icon: SettingsBrightnessIcon },
  { value: 'light', label: 'Light', Icon: LightModeIcon },
  { value: 'dark', label: 'Dark', Icon: DarkModeIcon }
]

export function ThemeToggle() {
  const { mode, setMode, mounted } = useColorScheme()

  const handleChange = (_: MouseEvent<HTMLElement>, next: ThemeMode | null) => {
    if (next) setMode(next)
  }

  return (
    <ToggleButtonGroup
      value={mounted ? mode : null}
      exclusive
      size="small"
      onChange={handleChange}
      aria-label="Theme"
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        bgcolor: 'background.paper',
        borderRadius: 999,
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: '999px !important',
          px: 1.25,
          py: 0.75,
          color: 'text.secondary',
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' }
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2
          }
        }
      }}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleButton
          key={value}
          value={value}
          aria-label={label}
          title={label}
          disabled={!mounted}
        >
          <Icon fontSize="small" />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
