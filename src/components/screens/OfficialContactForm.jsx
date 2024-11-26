import React, { useContext } from 'react'
import Header from '../header/Header'
import ContactForm from '../body/contact-form'
import Footer from '../footer/Footer'
import AuthContext from '../context/AuthContext'
import { Box, Card, Typography } from '@mui/material'

function OfficialContactForm() {

  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div>
        <Header fromContactForm={true}/>
        {!isAuthenticated ? (<ContactForm />) : (
          <>
          <Box className='p-5 my-20'>
        <Card className='p-4'>
        <Typography variant='h3' color='red' fontWeight={"bold"} textAlign={"center"}>
        This contact form is not used for internal system purposes
        </Typography>
        </Card>
        </Box>
          </>
        )} 
        <Footer />
    </div>
  )
}

export default OfficialContactForm