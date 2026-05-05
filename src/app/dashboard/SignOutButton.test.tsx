import { signOut } from 'next-auth/react'
import React from 'react'

import { SignOutButton } from './SignOutButton'

import {
  renderWithProviders,
  screen,
  setupUser
} from '@/test-utils/renderWithProviders'

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}))

const mockedSignOut = jest.mocked(signOut)

describe('SignOutButton', () => {
  it('renders a Sign out button', () => {
    renderWithProviders(<SignOutButton />)
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
  })

  it('calls signOut when clicked', async () => {
    const user = setupUser()
    renderWithProviders(<SignOutButton />)
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockedSignOut).toHaveBeenCalledTimes(1)
  })
})
