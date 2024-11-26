import React from 'react';
import { Box, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CommonFieldError from './CommonFieldError';
function CommonCheckBoxGroup({id, label, name, value, setValue, fieldName, objects, errors, setDefaultValues, trigger}) {

    // Function to handle change
    const handleChange = async (e) => {
        let arrayValue = value?.length > 0 ? value : [];

        if (e.target.checked) {
            arrayValue = arrayValue.includes(e.target.value) ? arrayValue : [...arrayValue, e.target.value];
        } else {
            arrayValue = arrayValue.filter((subValue) => subValue !== e.target.value);
        }

        setValue(fieldName, arrayValue);
        setDefaultValues((values) => {
            values[fieldName] = arrayValue;

            return {
                ...values
            }
        });

        if (!e.target.checked && arrayValue?.length === 0) {
            return;
        }

        await trigger(fieldName);
    };
    
    return (
        <Box>
           <FormLabel id={id} className='text-xl font-bold'> {label.toUpperCase()} </FormLabel>
           <FormGroup>
            {objects.map((minorObject, index) => (
                 <FormControlLabel
                 control={<Checkbox color="success" name={name}/>}
                 checked={value.includes(minorObject["value"]) ?? false}
                 label={minorObject["label"]}
                 value={minorObject["value"]}
                 onChange={handleChange}
                 name={minorObject["value"]}
                 key={index}
              />
            ))}
           </FormGroup>

        {errors[fieldName] && (
            <CommonFieldError errorMessage={ errors[fieldName]?.message}/>
        )}
        </Box>
     );
}

export default CommonCheckBoxGroup