'use client'
import { Box, Typography } from '@mui/material'
import React, { Suspense } from 'react'

import SignInForm from './SignInForm'

export default function SignIn() {
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
        Sign In
      </Typography>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </Box>
  )
}
