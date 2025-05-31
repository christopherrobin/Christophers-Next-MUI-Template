'use client'
import React from 'react'
import { Box, Typography, Button, Link } from '@mui/material'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight'

import { GitHubIcon } from '@/components/GitHubIcon'

export default function Home() {
  return (
    <Box minHeight="100vh" px={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        width={{ xs: '100%', md: '66%', lg: '50%' }}
        textAlign={{ xs: 'center', sm: 'left' }}
        sx={{ rowGap: 2, mt: 10, mb: 2 }}
      >
        <Typography variant="h1" gutterBottom>
          Howdy.
        </Typography>
        <Typography variant="h2" gutterBottom>
          Christophers-Next-MUI-Template
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <GitHubIcon style={{ width: 24, height: 24, color: 'white' }} />
          <Link
            href="https://github.com/christopherrobin/Christophers-Next-MUI-Template"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#90caf9', textDecoration: 'none', fontWeight: 500 }}
          >
            @christopherrobin
          </Link>
        </Box>
        <Typography variant="body1" gutterBottom>
          This is a template for Next.js applications with TypeScript, Material UI, and NextAuth.js. It includes a simple authentication flow, a protected dashboard, and reusable components to kickstart your project.
        </Typography>
        <Button
          component="a"
          href="/join"
          sx={{ alignSelf: 'center', my: 1, width: '100%' }}
          endIcon={<RocketLaunch style={{ width: 24, height: 24 }} />}
        >
          Join
        </Button>
        <Button
          component="a"
          href="/sign-in"
          sx={{ alignSelf: 'center', width: '100%' }}
          endIcon={<ArrowCircleRight style={{ width: 24, height: 24, color: '#1976d2' }} />}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  )
}
