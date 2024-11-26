import React, { useContext } from 'react';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';

import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import AuthContext from '../context/AuthContext';
import { Badge, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function Header({
  fromContactForm = false
}) {

    const {isAuthenticated, logOut, id} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
      logOut();
      navigate("/");
    };
  
    return (
       <Box sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 10}} className="p-5 bg-indigo-600 z-4">
         <Container maxWidth="xl" className='flex content-center justify-between'>
          <Box>
         <AdbIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          </Box>

          <Box>
            {(isAuthenticated && !fromContactForm) && (
              <Box className='flex flex-col lg:flex-row md:flex-row sm:flex-row lg'>
              <Chip label={`Organization ID: ${id}`} color="primary" className='mb-3 lg:my-auto lg:mr-2 md:my-auto md:mr-2 sm:my-auto sm:mr-2'/>
              <Box className="flex content-center justify-center">
              <Button variant='contained' type='submit' className="hover:bg-yellow-100" size='large' onClick={handleLogOut}> Log Out </Button>
              </Box>
              </Box>
            )}
          </Box>
         </Container>
      </Box>
    );
}

export default Header