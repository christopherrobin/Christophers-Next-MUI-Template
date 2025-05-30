import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Spinner: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <CircularProgress size={64} thickness={4} color="primary" />
    </Box>
  );
};

export default Spinner;
