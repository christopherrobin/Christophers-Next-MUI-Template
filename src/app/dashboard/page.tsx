'use client'
import { signOut, useSession } from 'next-auth/react'
import { Box, Typography } from '@mui/material'

import { Button } from '@/components/Button'
import Spinner from '@/components/Spinner'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { email } = session?.user || {}

  if (status === 'loading') {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Spinner />
      </Box>
    )
  }

  return (
    <Box px={4} py={6}>
      <Box component="main" display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="h6" color="primary" fontWeight={700} sx={{ wordBreak: 'break-word' }} gutterBottom>
          Welcome, {email}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} width="100%">
          <Box component="pre" sx={{ fontSize: '0.9rem', color: '#e0e0e0', whiteSpace: 'pre-wrap', overflowX: 'auto', background: '#1e1e1e', p: 2, borderRadius: 2, width: '100%' }}>
            <code>{JSON.stringify(session, null, 2)}</code>
          </Box>
          <Button onClick={() => signOut()}>Sign out</Button>
        </Box>
      </Box>
    </Box>
  )
}
