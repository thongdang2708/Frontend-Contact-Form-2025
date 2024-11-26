import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import dateValidationNotInFuture from '../utils/ValidateDate';
import CommonFieldError from './CommonFieldError';

function CommonResponsiveDatePicker({id, value, label, errors, fieldName, setValue, setDefaultValues, trigger}) {

    // Function to handle change
    const handleChange = async (value) => {
        setValue(fieldName, value);
        setDefaultValues((values) => {
            values[fieldName] = value;
            return {
                ...values
            }
        })
        
        await trigger(fieldName);
    };

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      components={[
        'DatePicker',
      ]}
      id={id}
    >
    <p className="text-md text-gray-500 mb-2"> {label.toUpperCase()}</p>
    <DatePicker name={fieldName} disableFuture format='DD/MM/YYYY' className='w-full left-0 right-0' value={value ? dayjs(value) : null} label={label} onChange={handleChange}/>
    </Box>
    </LocalizationProvider>

    {errors[fieldName] && (
      <CommonFieldError errorMessage={ errors[fieldName]?.message}/>
    )}

    {!dateValidationNotInFuture(value) && (
        <CommonFieldError errorMessage={"Invalid date format"}/>
    )}
  </>
  )
}

export default CommonResponsiveDatePicker