'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, TextField, Button, Link } from '@mui/material'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { helperTextSlot } from '@/lib/form-utils'
import { signUpSchema, type SignUpInput } from '@/lib/schemas'

export default function SignUp() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async ({ email, password }: SignUpInput) => {
    setServerError('')

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Failed to create account')
        return
      }
      // signIn() with redirect: false; callbackUrl arg would be a no-op
      // here because we handle navigation manually below.
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (signInResult?.error) {
        setServerError(signInResult.error)
        return
      }
      if (signInResult?.url) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('Sign-up error:', err)
      setServerError('An unexpected error occurred')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 4
      }}
    >
      <Typography
        variant="h3"
        color="primary"
        sx={{
          fontWeight: 700,
          mb: 4
        }}
      >
        Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              autoFocus
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={helperTextSlot('sign-up-email-error')}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              autoComplete="new-password"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              slotProps={helperTextSlot('sign-up-password-error')}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
        {serverError && (
          <Typography color="error" data-testid="sign-up-error">
            {serverError}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          mt: 2,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary'
          }}
        >
          Already have an account?{' '}
          <Link href="/sign-in" color="primary" underline="hover">
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
