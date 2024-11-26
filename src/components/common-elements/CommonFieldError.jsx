import React from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box } from '@mui/material';

function CommonFieldError( {errorMessage} ) {
  return (
    <Box className="flex">
        <WarningAmberIcon color='error' className="mr-2"/>
        <p className="text-red-600 mt-0.5"> {errorMessage} </p>
    </Box>
  )
}

export default CommonFieldError