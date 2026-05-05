'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  type FormHelperTextProps
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { signUpSchema, type SignUpInput } from '@/lib/schemas'

export default function SignUp() {
  const { status } = useSession()
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

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  const onSubmit = async ({ email, password }: SignUpInput) => {
    setServerError('')

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/dashboard'
        })

        if (signInResult?.error) {
          setServerError(signInResult.error)
        } else if (signInResult?.url) {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        setServerError(data.error || 'Failed to create account')
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
              slotProps={{
                formHelperText: {
                  'data-testid': 'sign-up-email-error'
                } as Partial<FormHelperTextProps>
              }}
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
              slotProps={{
                formHelperText: {
                  'data-testid': 'sign-up-password-error'
                } as Partial<FormHelperTextProps>
              }}
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
