'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Typography,
  Link,
  TextField,
  Button,
  type FormHelperTextProps
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { signInSchema, type SignInInput } from '@/lib/schemas'

function isSafeRelativePath(value: string | null): value is string {
  if (!value) return false
  if (!value.startsWith('/')) return false
  if (value.startsWith('//')) return false
  if (value.startsWith('/\\')) return false
  return true
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState('')
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async ({ email, password }: SignInInput) => {
    setServerError('')

    const requested = searchParams.get('callbackUrl')
    const callbackUrl = isSafeRelativePath(requested) ? requested : '/dashboard'

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })
      if (result?.error) {
        setServerError(result.error)
      } else if (result?.url) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setServerError('An unexpected error occurred')
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
      onSubmit={handleSubmit(onSubmit)}
      noValidate
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
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              formHelperText: {
                'data-testid': 'sign-in-email-error'
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
            autoComplete="current-password"
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              formHelperText: {
                'data-testid': 'sign-in-password-error'
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
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
      {serverError && (
        <Typography color="error" data-testid="sign-in-error">
          {serverError}
        </Typography>
      )}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" color="primary" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default SignInForm
