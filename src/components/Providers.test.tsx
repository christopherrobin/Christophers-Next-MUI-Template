import { useTheme } from '@mui/material'
import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import { Providers } from './Providers'

function ThemeProbe() {
  const theme = useTheme()
  return <div data-testid="primary">{theme.palette.primary.main}</div>
}

function SessionProbe() {
  const { status } = useSession()
  return <div data-testid="status">{status}</div>
}

beforeEach(() => {
  ;(globalThis as unknown as { fetch: jest.Mock }).fetch = jest
    .fn()
    .mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({}),
      text: async () => '{}',
      clone() {
        return this
      }
    })
})

describe('Providers', () => {
  it('renders its children', () => {
    render(
      <Providers>
        <span>hello world</span>
      </Providers>
    )
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('exposes the MUI theme to descendants with the brand primary', () => {
    render(
      <Providers>
        <ThemeProbe />
      </Providers>
    )
    // jsdom resolves to light mode (matchMedia → not dark). Light mode uses the
    // darkened brand green (WCAG AA white-text contrast); dark mode keeps the
    // bright `#20cb91`. Either way the theme must reach descendants.
    expect(screen.getByTestId('primary')).toHaveTextContent('rgb(22, 142, 101)')
  })

  it('mounts SessionProvider so useSession works without throwing', async () => {
    render(
      <Providers>
        <SessionProbe />
      </Providers>
    )
    await waitFor(() => {
      expect(screen.getByTestId('status')).toBeInTheDocument()
    })
  })
})
