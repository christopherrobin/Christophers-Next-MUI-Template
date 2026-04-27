import { signOut, useSession } from 'next-auth/react'

import { makeSession } from '@/test-utils/factories'
import {
  renderWithProviders,
  screen,
  setupUser
} from '@/test-utils/renderWithProviders'

import Dashboard from './page'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

const mockedUseSession = jest.mocked(useSession)
const mockedSignOut = jest.mocked(signOut)

describe('Dashboard page', () => {
  it('shows the spinner while the session is loading', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn()
    })

    renderWithProviders(<Dashboard />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders nothing when unauthenticated (defensive guard)', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn()
    })

    const { container } = renderWithProviders(<Dashboard />)
    expect(container).toBeEmptyDOMElement()
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      mockedUseSession.mockReturnValue({
        data: makeSession({ user: { email: 'a@b.com' } }),
        status: 'authenticated',
        update: jest.fn()
      })
    })

    it('renders the dashboard heading and welcome line', () => {
      renderWithProviders(<Dashboard />)
      expect(
        screen.getByRole('heading', { name: /dashboard/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/welcome,\s*a@b\.com/i)).toBeInTheDocument()
    })

    it('renders the JSON-stringified session payload', () => {
      renderWithProviders(<Dashboard />)
      expect(screen.getByTestId('session-json')).toHaveTextContent(/a@b\.com/)
    })

    it('calls signOut when the Sign out button is clicked', async () => {
      const user = setupUser()
      renderWithProviders(<Dashboard />)
      await user.click(screen.getByRole('button', { name: /sign out/i }))
      expect(mockedSignOut).toHaveBeenCalledTimes(1)
    })
  })
})
