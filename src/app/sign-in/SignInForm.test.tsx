import { signIn } from 'next-auth/react'

import {
  renderWithProviders,
  screen,
  setupUser,
  waitFor
} from '@/test-utils/renderWithProviders'

import SignInForm from './SignInForm'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams()
}))

const mockedSignIn = jest.mocked(signIn)

beforeEach(() => {
  ;(window as unknown as { location: { href: string } }).location = {
    href: ''
  }
})

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

  it('calls signIn with credentials, redirect:false, and callbackUrl', async () => {
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
      redirect: false,
      callbackUrl: '/dashboard'
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
      expect(window.location.href).toBe('/dashboard')
    })
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
    expect(window.location.href).toBe('')
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
