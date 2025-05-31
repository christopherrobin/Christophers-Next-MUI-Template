import { Box, Typography, Link, TextField, Button } from '@mui/material'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard'
      })
      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
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
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link href="/join" color="primary" underline="hover">
            Join now
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default SignInForm
