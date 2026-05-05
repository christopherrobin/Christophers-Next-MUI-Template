import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import React from 'react'

import Dashboard from './page'

import { makeSession } from '@/test-utils/factories'
import { renderWithProviders, screen } from '@/test-utils/renderWithProviders'

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT')
  })
}))

// SignOutButton is a client island that uses next-auth/react. Stub it to
// keep this test focused on the server component's rendered output.
jest.mock('./SignOutButton', () => ({
  SignOutButton: () => <button type="button">Sign out</button>
}))

const mockedGetServerSession = jest.mocked(getServerSession)
const mockedRedirect = redirect as unknown as jest.Mock

describe('Dashboard page (server component)', () => {
  it('greets the authenticated user and renders the session JSON', async () => {
    const session = makeSession({ user: { email: 'a@b.com' } })
    mockedGetServerSession.mockResolvedValue(session)

    const ui = await Dashboard()
    renderWithProviders(ui as React.ReactElement)

    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/welcome,\s*a@b\.com/i)).toBeInTheDocument()
    expect(screen.getByTestId('session-json')).toHaveTextContent(/a@b\.com/)
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
  })

  it('redirects to /sign-in when no session is present', async () => {
    mockedGetServerSession.mockResolvedValue(null)

    await expect(Dashboard()).rejects.toThrow('NEXT_REDIRECT')
    expect(mockedRedirect).toHaveBeenCalledWith('/sign-in')
  })
})
