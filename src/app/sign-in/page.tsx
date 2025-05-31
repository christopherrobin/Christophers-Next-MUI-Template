'use client'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

import SignInForm from './SignInForm'

export default function SignIn() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

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
        Sign In
      </Typography>
      <SignInForm />
    </Box>
  )
}
