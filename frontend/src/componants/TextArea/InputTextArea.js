import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 100,
    },
  },
}));
const TextArea = ({ rows, rowsMax, placeholder, onChange, value, label, variant, multilinerows, style }) => {
  const classes = useStyles();

  return (
    <label>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          multiline
          onChange={onChange}
          value={value}
          rows={rows}
          style={style}
          multilinerows={multilinerows}
          rowsMax={rowsMax}
          placeholder={placeholder}
          label={label}
          variant={variant}
        />
      </form>
    </label>
  );
};
export default TextArea;
