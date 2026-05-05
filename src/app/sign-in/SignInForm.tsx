'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Link, TextField, Button } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { helperTextSlot } from '@/lib/form-utils'
import { signInSchema, type SignInInput } from '@/lib/schemas'
import { isSafeRelativePath } from '@/lib/url-utils'

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
      // signIn() callbackUrl arg is a no-op when redirect: false — we
      // handle navigation manually with the validated callbackUrl below.
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (result?.error) {
        setServerError(result.error)
        return
      }
      if (result?.url) {
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
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={helperTextSlot('sign-in-email-error')}
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
            slotProps={helperTextSlot('sign-in-password-error')}
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
