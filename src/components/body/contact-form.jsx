import { Box, Card, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback, useContext } from 'react'
import HeaderForm from './header-form';
import BodyForm from './body-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../screens/NotFound';
import CommonLoading from '../common-elements/CommonLoading';

function ContactForm() {
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [existsOrganization, setExistsOrganization] = useState(false);
  const params = useParams();
  const organizationId = params?.id;
  const [isLoading, setIsLoading] = useState(false);

  // Set callback to fetch to check existed organization

  const checkOrganizationId = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/v1/organization/existsOrganization/${organizationId}`);
      
      const data = response?.data;
      setExistsOrganization(data?.exists);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      setExistsOrganization(false);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  // Set effect to check whether organization exists or not
  useEffect(() => {
    checkOrganizationId();
  }, [checkOrganizationId]);

  if (isLoading) {
    return <CommonLoading />;
  }

  if (organizationId == null || !existsOrganization) {
    return (<NotFound />);
  }
  
  if (isSubmittedSuccessfully) {
    return (
      <Box className='p-5 my-20'>
      <Card className='p-4'>
      <Typography variant='h5'>
        Thank you for submitting the contact form! You will receive an email notification! Please check your email!
      </Typography>
      </Card>
      </Box>
    )
  }

  return (
    <Box className='p-5 my-20'>
        <Card className='p-5'>
            <HeaderForm/>
            <BodyForm setIsSubmittedSuccessfully={setIsSubmittedSuccessfully} organizationId={organizationId}/>
        </Card>
    </Box>
  )
}

export default ContactForm;