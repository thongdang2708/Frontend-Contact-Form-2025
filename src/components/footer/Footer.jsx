import React from 'react'
import Box from "@mui/material/Box";
import { Container } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

function Footer() {
  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, zIndex: 10}} className="p-5 bg-indigo-600 z-4">
        <Container>
            <h1 className="text-center font-bold"> <AlternateEmailIcon /> Contact Form Demo </h1>
        </Container>
    </Box>
  )
}

export default Footer;