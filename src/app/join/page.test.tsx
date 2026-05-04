import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

import Join from './page'

import {
  renderWithProviders,
  screen,
  setupUser,
  waitFor
} from '@/test-utils/renderWithProviders'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

const mockedSignIn = jest.mocked(signIn)
const mockedUseSession = jest.mocked(useSession)
const mockedUseRouter = jest.mocked(useRouter)

function makeRouter() {
  return {
    replace: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn()
  }
}

function setSessionStatus(
  status: 'loading' | 'authenticated' | 'unauthenticated'
) {
  mockedUseSession.mockReturnValue({
    data: status === 'authenticated' ? ({} as never) : null,
    status,
    update: jest.fn()
  } as never)
}

let currentRouter = makeRouter()

beforeEach(() => {
  currentRouter = makeRouter()
  setSessionStatus('unauthenticated')
  mockedUseRouter.mockReturnValue(currentRouter as never)
})

async function fillAndSubmit(email = 'a@b.com', password = 'ChrisIsTheBest42!') {
  const user = setupUser()
  await user.type(screen.getByLabelText(/email/i), email)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /^join$/i }))
}

describe('Join page', () => {
  it('renders email, password, and join button', () => {
    renderWithProviders(<Join />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^join$/i })).toBeInTheDocument()
  })

  it('renders a Sign In link to /sign-in', () => {
    renderWithProviders(<Join />)
    const link = screen.getByRole('link', { name: /sign in/i })
    expect(link).toHaveAttribute('href', '/sign-in')
  })

  it('redirects to /dashboard when session becomes authenticated', () => {
    const router = makeRouter()
    mockedUseRouter.mockReturnValue(router as never)
    setSessionStatus('authenticated')

    renderWithProviders(<Join />)
    expect(router.replace).toHaveBeenCalledWith('/dashboard')
  })

  it('POSTs /api/join then signs in on success', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    ;(globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: '/dashboard',
      code: undefined
    } as never)

    renderWithProviders(<Join />)
    await fillAndSubmit('new@example.com', 'ChrisIsTheBest42!')

    expect(fetchMock).toHaveBeenCalledWith('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@example.com', password: 'ChrisIsTheBest42!' })
    })
    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: 'new@example.com',
      password: 'ChrisIsTheBest42!',
      redirect: false,
      callbackUrl: '/dashboard'
    })

    await waitFor(() => {
      expect(currentRouter.push).toHaveBeenCalledWith('/dashboard')
    })
    expect(currentRouter.refresh).toHaveBeenCalled()
  })

  it('shows the API error message when /api/join responds non-ok', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Email already in use' })
    })
    ;(globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock

    renderWithProviders(<Join />)
    await fillAndSubmit('dup@example.com', 'ChrisIsTheBest42!')

    expect(await screen.findByTestId('join-error')).toHaveTextContent(
      /email already in use/i
    )
    expect(mockedSignIn).not.toHaveBeenCalled()
  })

  it('shows a fallback error when fetch rejects', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = jest.fn().mockRejectedValue(new Error('network'))
    ;(globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock

    renderWithProviders(<Join />)
    await fillAndSubmit()

    expect(await screen.findByTestId('join-error')).toHaveTextContent(
      /unexpected error/i
    )
    consoleSpy.mockRestore()
  })

  it('disables the submit button while pending', async () => {
    let resolveFetch: (value: unknown) => void = () => {}
    const fetchMock = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        })
    )
    ;(globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock

    renderWithProviders(<Join />)
    await fillAndSubmit()

    const button = screen.getByRole('button', { name: /joining/i })
    expect(button).toBeDisabled()

    resolveFetch({ ok: false, json: async () => ({ error: 'x' }) })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^join$/i })).not.toBeDisabled()
    })
  })
})
