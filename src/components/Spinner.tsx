'use client'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Spinner: React.FC = () => {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <CircularProgress size={64} thickness={4} color="primary" />
    </Box>
  )
}

export default Spinner
