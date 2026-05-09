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

  it('exposes the MUI theme to descendants with brand primary preserved', () => {
    render(
      <Providers>
        <ThemeProbe />
      </Providers>
    )
    // `#20cb91` is the brand primary in BOTH light and dark color schemes —
    // theme refactor must preserve this contract.
    expect(screen.getByTestId('primary')).toHaveTextContent('#20cb91')
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
