import { Box, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import createAxiosInstance from '../axios-middleware/createAxiosInstance';
import NotFound from '../screens/NotFound';
import { DataGrid } from '@mui/x-data-grid';
import CommonLoading from '../common-elements/CommonLoading';
import { useNavigate } from 'react-router-dom';

function TableOfCases() {

  const { id, setRefreshTokenFunction, logOut} = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Callback function to fetch cases by organization id
  const fetchCasesByOrganizationId = useCallback(async () => {
    setLoading(true);
    try {

    const axiosInstance = createAxiosInstance({
      setRefreshTokenFunction, logOut
    });

    if (id != null) {
      const response = await axiosInstance.get(import.meta.env.VITE_API_KEY + `/api/v1/case/organization/${id}`);

      const data = response?.data;

      setCases(data?.cases ?? []);
    }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  },[id, setRefreshTokenFunction, logOut]);

  // Use effect to trigger callback function
  useEffect(() => {
    fetchCasesByOrganizationId();
  }, [fetchCasesByOrganizationId]);

  // Set columns for DataGrid

  const columns = [
    { field: 'id', headerName: 'Case ID', flex: 1},
    {
      field: 'organizationName',
      headerName: 'Organization name',
      flex: 1,
      sortable: true
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      sortable: true
    },
  ];

  // Map cases to get createdAt with correct locale string format
  const mappedCases = cases?.length > 0 ? cases.map((singleCase) => ({
      ...singleCase,
      createdAt: new Date(singleCase?.createdAt).toLocaleString(),
  })) : [];

  // Function to handle single row click
  const handleRowClick = (e) => {
      navigate(`/case-table/${e.id}`);
  }

  if (notFound) {
    return <NotFound />
  }

  if (loading) {
    return (
      <CommonLoading />
    )
  }

  return (
    <Box className='p-5 my-20'>
      <Box className='p-5'>

      {mappedCases?.length > 0 ? (
         <DataGrid
         rows={mappedCases}
         columns={columns}
         initialState={{
           pagination: {
             paginationModel: {
               pageSize: 10,
             },
           },
         }}
         pageSizeOptions={[10]}
         checkboxSelection={false}
         disableRowSelectionOnClick={false}
         onRowClick={handleRowClick}
       />
      ) : 
      (
        <>
        <Typography variant='h3' className='font-bold text-center text-red-500'> There are no created cases </Typography>
        </>
      )
      }
     
      </Box>
    </Box>
  )
}

export default TableOfCases