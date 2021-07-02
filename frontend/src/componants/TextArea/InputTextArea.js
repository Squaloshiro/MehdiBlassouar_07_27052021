import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',

        },

    },
}));
const TextArea = ({ rows, rowsMax, placeholder, onChange, value, id, label, variant, multilinerows }) => {
    const classes = useStyles();
    return <form className={classes.root} noValidate autoComplete="off">
        <TextField multiline onChange={onChange} value={value} rows={rows} multilinerows={multilinerows} rowsMax={rowsMax} placeholder={placeholder} id={id} label={label} variant={variant} />
    </form>


}
export default TextArea
