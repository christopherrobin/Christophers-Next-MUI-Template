import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { renderWithProviders, screen } from '@/test-utils/renderWithProviders'

import SignIn from './page'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('./SignInForm', () => ({
  __esModule: true,
  default: () => <div data-testid="sign-in-form" />
}))

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

describe('SignIn page', () => {
  it('renders the sign-in form when unauthenticated', () => {
    setSessionStatus('unauthenticated')
    mockedUseRouter.mockReturnValue(makeRouter() as never)

    renderWithProviders(<SignIn />)

    expect(screen.getByTestId('sign-in-form')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
  })

  it('does not redirect when already authenticated (middleware handles it server-side)', () => {
    const router = makeRouter()
    setSessionStatus('authenticated')
    mockedUseRouter.mockReturnValue(router as never)

    renderWithProviders(<SignIn />)

    expect(router.replace).not.toHaveBeenCalled()
  })

  it('does not redirect while session is loading', () => {
    const router = makeRouter()
    setSessionStatus('loading')
    mockedUseRouter.mockReturnValue(router as never)

    renderWithProviders(<SignIn />)

    expect(router.replace).not.toHaveBeenCalled()
  })
})
