import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CommonFieldError from './CommonFieldError';

function CommonRadioGroup({id, label, name, value, setValue, fieldName, objects, errors, setDefaultValues, trigger}) {

  return (
    <FormControl>
    <FormLabel id={id} className='text-xl font-bold'> {label.toUpperCase()} </FormLabel>
    <RadioGroup
      aria-labelledby="demo-controlled-radio-buttons-group"
      name={name}
      value={value}
      row
      onChange={async (e) => {
        setDefaultValues((values) => {
            values[fieldName] = e.target.value;

            return {
                ...values,
            }
        })
        setValue(fieldName, e.target.value)
        await trigger(fieldName);
    }}
    >
    {objects.map((minorObject, index) => {
        return (
        <FormControlLabel key={index} value={minorObject["value"]} control={<Radio checked={minorObject["value"] === value}/>} label={minorObject["label"]} />
        )
    })}
    </RadioGroup>

    {errors[fieldName] && (
        <CommonFieldError errorMessage={errors[fieldName]?.message}/>
    )}
  </FormControl>
  )
}

export default CommonRadioGroup