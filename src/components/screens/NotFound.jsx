import { Card, Container, Typography } from '@mui/material'
import React from 'react'

function NotFound() {
  return (
    <Container>
        <Card className="p-5 my-28"> 
            <Typography variant='h4' color='red' textAlign={"center"}> Not Found, please check again you input! </Typography> 
        </Card>
    </Container>
  )
}

export default NotFound