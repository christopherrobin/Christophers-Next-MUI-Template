// src/app/not-found.tsx
'use client'
import { Box, Typography, Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      <Typography variant="h2" color="primary" fontWeight={700} gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/"
        sx={{ mt: 3 }}
      >
        Go Home
      </Button>
    </Box>
  )
}
