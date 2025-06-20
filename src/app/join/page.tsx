'use client'
import { Box, Typography, TextField, Button, Link } from '@mui/material'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export default function Join() {
  const { status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First create the account
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        // Account created successfully, now sign in directly
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/dashboard'
        })

        if (signInResult?.error) {
          setError(signInResult.error)
        } else if (signInResult?.url) {
          // Manually navigate to dashboard
          window.location.href = signInResult.url
        }
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (err) {
      console.error('Join error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      <Typography variant="h3" color="primary" fontWeight={700} mb={4}>
        Join
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        maxWidth={400}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
          autoComplete="email"
          fullWidth
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
          autoComplete="current-password"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Joining...' : 'Join'}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/join" color="primary" underline="hover">
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
