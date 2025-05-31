'use client'
import { Box, Typography } from '@mui/material'
import { Button } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'

import Spinner from '@/components/Spinner'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { email } = session?.user || {}

  if (status === 'loading') {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Spinner />
      </Box>
    )
  }

  return (
    <Box px={4} py={6}>
      <Box component="main" display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          fontWeight={700}
          sx={{ wordBreak: 'break-word' }}
          gutterBottom
        >
          Welcome, {email}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} width="100%">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <Box
              component="pre"
              sx={{
                fontSize: '0.9rem',
                color: 'grey.300',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                bgcolor: 'grey.900',
                p: 2,
                borderRadius: 2,
                width: '100%'
              }}
            >
              {JSON.stringify(session, null, 2)}
            </Box>
          </Box>
          <Button onClick={() => signOut()}>Sign out</Button>
        </Box>
      </Box>
    </Box>
  )
}
