import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import AuthContext from '../context/AuthContext';
import CardMedia from '@mui/material/CardMedia';
import NotFound from '../screens/NotFound';
import CommonLoading from '../common-elements/CommonLoading';
import createAxiosInstance from '../axios-middleware/createAxiosInstance';
import { Container } from '@mui/material';
import Divider from '@mui/material/Divider';
import { DoesThePersonHaveDifficultyRememberingThingsOrIsConfused, HowIndependentIsThePersonConcernedInEverydayLife, SupportReceived, WhatIsTheMainReasonForYourRequest } from '../../objects/FieldObjects';
import CommonListItem from '../common-elements/CommonListItem';
import getEnvironments from '../utils/GetEnv';
function SingleCase() {

  const params = useParams();
  const caseId = params?.id;
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const {setRefreshTokenFunction, logOut} = useContext(AuthContext);
  const [singleCase, setSingleCase] = useState({});
  const {id} = useContext(AuthContext);
  // Callback function to fetch single case
  const fetchSingleCase = useCallback(async () => {

    setLoading(true);

    try {
    
    const axiosInstance = createAxiosInstance({
        setRefreshTokenFunction, logOut
    });

    if (caseId != null) {
        const response = await axiosInstance.get(getEnvironments() + `/api/v1/case/${caseId}`);

        const data = response?.data;
    
        setSingleCase(data);    
    }

    } catch (error) {
        console.error(error);
        setNotFound(true);
    } finally {
        setLoading(false);
    }
  }, [caseId, setRefreshTokenFunction, logOut]);

  // Set useEffect to fetch callback function

  useEffect(() => {
    fetchSingleCase();
  },[fetchSingleCase]);

  // Set useEffect to check organization can check only a case created for it
  useEffect(() => {
    if (id != null && singleCase?.organization?._id != null && id !== singleCase?.organization?._id) {
        setNotFound(true);
    }
  }, [singleCase?.organization?._id, id, setNotFound])
 
  if (notFound || caseId == null) {
    return <NotFound />;
  }

  if (loading) {
    return <CommonLoading />;
  }

  return (
    <>
    <Container className='my-20 p-5'>
    <Card >
      <CardActionArea>
      <CardMedia
        sx={{ height: 240 }}
        image="https://www.pubbelly.com/wp-content/uploads/2023/10/42427.webp"
        title="Case"
      />
        <CardContent key={singleCase?._id}>
          <Typography variant="h5" fontWeight={"bold"} marginBottom={2}>
            Case ID: {singleCase?._id} create for {singleCase?.organization?.username}
          </Typography>
            <Divider />
         <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            Created By Patient : {singleCase?.firstName} {singleCase?.lastName}
          </Typography>
          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            Patient Gender: {singleCase?.gender}
          </Typography>

          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            Date of Birth: {new Date(singleCase?.dateOfBirth).toDateString()}
          </Typography>

          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            Telephone Number: {singleCase?.telephoneNumberOfInquirer} 
          </Typography>

          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            Email address: {singleCase?.inquirerEmailAddress} 
          </Typography>

          <Divider />
          <Typography variant='h5' fontWeight={"bold"} marginBottom={2}> Specific Request Information </Typography>
          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            HOW INDEPENDENT IS THE PERSON CONCERNED IN EVERYDAY LIFE?
          </Typography>
          {HowIndependentIsThePersonConcernedInEverydayLife.filter((object) => object.value === singleCase?.howIndependentIsThePersonConcernedInEverydayLife).length > 0 ? HowIndependentIsThePersonConcernedInEverydayLife.filter((object) => object.value === singleCase?.howIndependentIsThePersonConcernedInEverydayLife).map((singleValue, index) => (
            <CommonListItem index={index} label={singleValue?.label}/>
          )) : 
            (
            <p> No Result </p>
            )
          }
          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            DOES THE PERSON HAVE DIFFICULTY REMEMBERING THINGS OR IS CONFUSED?
          </Typography>
          {DoesThePersonHaveDifficultyRememberingThingsOrIsConfused.filter((object) => object.value === singleCase?.doesThePersonHaveDifficultyRememberingThingsOrIsConfused).length > 0 ? DoesThePersonHaveDifficultyRememberingThingsOrIsConfused.filter((object) => object.value === singleCase?.doesThePersonHaveDifficultyRememberingThingsOrIsConfused).map((singleValue, index) => (
            <CommonListItem index={index} label={singleValue?.label}/>
          )) : 
            (
            <p> No Result </p>
            )
          }
          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            WHAT KIND OF SUPPORT DOES THE PERSON CONCERNED CURRENTLY RECEIVE?
          </Typography>
          {SupportReceived.filter((object) => singleCase?.whatKindOfSupportDoesThePersonConcernedCurrentlyReceive?.length > 0 ? singleCase?.whatKindOfSupportDoesThePersonConcernedCurrentlyReceive.includes(object.value) : false)?.length > 0 ? SupportReceived?.filter((object) => singleCase?.whatKindOfSupportDoesThePersonConcernedCurrentlyReceive.includes(object.value))?.map((singleValue, index) => (
            <CommonListItem index={index} label={singleValue?.label}/>
          )) : (
            <p> No Result </p>
          )}
          <Typography variant="body1" fontWeight={"bold"} marginBottom={2}>
            WHAT IS THE MAIN REASON FOR YOUR REQUEST?
          </Typography>
          {WhatIsTheMainReasonForYourRequest.filter((object) => object.value === singleCase?.whatIsTheMainReasonForYourRequest)?.length > 0 ? WhatIsTheMainReasonForYourRequest?.filter((object) => object.value === singleCase?.whatIsTheMainReasonForYourRequest)?.map((singleValue, index) => (
            <CommonListItem index={index} label={singleValue?.label}/>
          )) : (
            <p> No Result </p>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
    </Container>
    </>
  )
}

export default SingleCase;