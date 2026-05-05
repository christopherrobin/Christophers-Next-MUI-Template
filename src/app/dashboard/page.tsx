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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Spinner />
      </Box>
    )
  }

  if (!session) return null

  return (
    <Box
      sx={{
        px: 4,
        py: 6
      }}
    >
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{
            fontWeight: 700,
            wordBreak: 'break-word'
          }}
        >
          Welcome, {email}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%'
            }}
          >
            <Box
              component="pre"
              data-testid="session-json"
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
