'use client'
import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'

/** Triggers NextAuth client-side sign-out and redirects to the configured callback. */
export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>
}
