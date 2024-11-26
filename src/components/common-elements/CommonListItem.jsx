import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
function CommonListItem({index, label}) {
  return (
    <ListItem key={`${index}`}>
    <ListItemText primary={`- ${label}`}/>
    </ListItem>
  )
}

export default CommonListItem