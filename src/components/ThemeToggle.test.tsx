import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {
  ColorSchemeProvider,
  STORAGE_KEY,
  __resetColorSchemeForTest
} from './ColorSchemeProvider'
import { ThemeToggle } from './ThemeToggle'

const renderWithProvider = () =>
  render(
    <ColorSchemeProvider>
      <ThemeToggle />
    </ColorSchemeProvider>
  )

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    __resetColorSchemeForTest()
  })

  it('renders three theme buttons once mounted', async () => {
    renderWithProvider()
    expect(await screen.findByRole('button', { name: 'System' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Light' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Dark' })).toBeEnabled()
  })

  it('marks System as pressed by default', async () => {
    renderWithProvider()
    expect(
      await screen.findByRole('button', { name: 'System', pressed: true })
    ).toBeInTheDocument()
  })

  it('switches to Light when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    const light = screen.getByRole('button', { name: 'Light' })
    await user.click(light)
    expect(light).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches to Dark when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    const dark = screen.getByRole('button', { name: 'Dark' })
    await user.click(dark)
    expect(dark).toHaveAttribute('aria-pressed', 'true')
  })

  it('persists choice to localStorage under the configured storage key', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    await user.click(screen.getByRole('button', { name: 'Dark' }))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('hydrates pre-stored mode on first mount', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark')
    renderWithProvider()
    expect(
      await screen.findByRole('button', { name: 'Dark', pressed: true })
    ).toBeInTheDocument()
  })

  it('resolves system mode against prefers-color-scheme: dark', async () => {
    const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('dark'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn()
        }) as unknown as MediaQueryList
    )
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    expect(document.documentElement).toHaveClass('dark')
    matchMediaSpy.mockRestore()
  })

  it('does not throw when localStorage.setItem is blocked', async () => {
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceeded')
      })
    const user = userEvent.setup()
    renderWithProvider()
    await screen.findByRole('button', { name: 'System', pressed: true })
    await user.click(screen.getByRole('button', { name: 'Light' }))
    // Click handler should not have crashed; new pressed state still applied.
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    setItemSpy.mockRestore()
  })
})
