'use client'
import GitHubIcon from '@mui/icons-material/GitHub'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import { Box, Typography, Button } from '@mui/material'
import React from 'react'

export default function Home() {
  return (
    <Box
      minHeight="100vh"
      px={6}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
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
        <Typography variant="h1" color="primary">
          Howdy.
        </Typography>
        <Typography variant="h2" gutterBottom>
          Christophers-Next-MUI-Template
        </Typography>
        <Box>
          <Button
            variant="outlined"
            component="a"
            href="https://github.com/christopherrobin/Christophers-Next-MUI-Template"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GitHubIcon style={{ width: 24, height: 24 }} />}
            sx={{ mb: 2, width: '100%' }}
          >
            View on GitHub
          </Button>
        </Box>
        <Typography variant="body1" gutterBottom>
          This is a template for Next.js applications with TypeScript, Material
          UI, and NextAuth.js. It includes a simple authentication flow, a
          protected dashboard, and reusable components to kickstart your
          project.
        </Typography>
        <Button
          variant="contained"
          component="a"
          href="/join"
          sx={{ alignSelf: 'center', my: 1, width: '100%' }}
          endIcon={<RocketLaunch style={{ width: 24, height: 24 }} />}
        >
          Join
        </Button>
        <Button
          variant="text"
          component="a"
          href="/sign-in"
          sx={{ alignSelf: 'center', width: '100%', maxWidth: 150 }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  )
}
