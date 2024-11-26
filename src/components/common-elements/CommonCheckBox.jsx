import React from 'react';
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel, FormGroup } from '@mui/material';
import CommonFieldError from './CommonFieldError';
function CommonCheckBox({id, value, setDefaultValues, setValue, label, name, errors, trigger, fieldName}) {

    // Function to handle change
    const handleChange = async (e) => {
        setValue(fieldName, e.target.checked);
        setDefaultValues((values) => {
            values[fieldName] = e.target.checked;

            return {
                ...values,
            }
        });

        if (!e.target.checked && value) {
            return;
        }
        await trigger(fieldName);
    };

  return (
    <> 
    <FormGroup id={id}>
        <FormControlLabel
            control={<Checkbox color="success" name={name}/>}
            checked={value}
            label={label}
            onChange={handleChange}
            name={name}
        />
    </FormGroup>

    {errors[fieldName] && (
        <CommonFieldError errorMessage={errors[fieldName]?.message}/>
    )}
    </>
  )
}

export default CommonCheckBox