import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const TextArea = ({rowsMin , placeholder, onChange, value })=>{

return <TextareaAutosize aria-label="empty" onChange={onChange}  value={value} rowsMin={rowsMin} placeholder={placeholder} />

}
export default TextArea
