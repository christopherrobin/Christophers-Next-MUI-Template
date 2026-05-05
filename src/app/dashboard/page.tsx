import { Box, Typography } from '@mui/material'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { SignOutButton } from './SignOutButton'

import { authOptions } from '@/lib/auth'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  const { email } = session.user

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
          <SignOutButton />
        </Box>
      </Box>
    </Box>
  )
}
