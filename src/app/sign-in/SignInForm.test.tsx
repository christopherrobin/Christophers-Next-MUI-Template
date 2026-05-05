import { signIn } from 'next-auth/react'

import SignInForm from './SignInForm'

import {
  renderWithProviders,
  screen,
  setupUser,
  waitFor
} from '@/test-utils/renderWithProviders'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

const mockedPush = jest.fn()
const mockedRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockedPush, refresh: mockedRefresh }),
  useSearchParams: () => new URLSearchParams()
}))

const mockedSignIn = jest.mocked(signIn)

async function fillAndSubmit(email = 'a@b.com', password = 'pw') {
  const user = setupUser()
  await user.type(screen.getByLabelText(/email/i), email)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /sign in/i }))
}

describe('SignInForm', () => {
  it('renders email, password, and submit', () => {
    renderWithProviders(<SignInForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('calls signIn with credentials and redirect:false', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: '/dashboard',
      code: undefined
    } as never)

    renderWithProviders(<SignInForm />)
    await fillAndSubmit('user@example.com', 'secret')

    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: 'user@example.com',
      password: 'secret',
      redirect: false
    })
  })

  it('navigates to the returned url on successful sign-in', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: '/dashboard',
      code: undefined
    } as never)

    renderWithProviders(<SignInForm />)
    await fillAndSubmit()

    await waitFor(() => {
      expect(mockedPush).toHaveBeenCalledWith('/dashboard')
    })
    expect(mockedRefresh).toHaveBeenCalled()
  })

  it('renders the signIn error message when result.error is set', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'Invalid password',
      status: 401,
      url: null,
      code: undefined
    } as never)

    renderWithProviders(<SignInForm />)
    await fillAndSubmit()

    expect(await screen.findByTestId('sign-in-error')).toHaveTextContent(
      /invalid password/i
    )
    expect(mockedPush).not.toHaveBeenCalled()
  })

  it('renders a fallback error when signIn rejects', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedSignIn.mockRejectedValueOnce(new Error('boom'))

    renderWithProviders(<SignInForm />)
    await fillAndSubmit()

    expect(await screen.findByTestId('sign-in-error')).toHaveTextContent(
      /unexpected error/i
    )
    consoleSpy.mockRestore()
  })

  it('disables the submit button while the request is pending', async () => {
    let resolveSignIn: (value: unknown) => void = () => {}
    mockedSignIn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve
        }) as never
    )

    renderWithProviders(<SignInForm />)
    await fillAndSubmit()

    const button = screen.getByRole('button', { name: /signing in/i })
    expect(button).toBeDisabled()

    resolveSignIn({ ok: true, url: '/dashboard' })
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).not.toBeDisabled()
    })
  })
})
