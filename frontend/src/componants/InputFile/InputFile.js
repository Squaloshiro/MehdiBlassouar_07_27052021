import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export default function UploadButtons({ onChange, label, theInputKey }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <input
        label={label}
        aria-label="upload picture"
        onChange={onChange}
        key={theInputKey || ""}
        className={classes.input}
        id="icon-button-file"
        type="file"
      />
      <label aria-label="upload picture" htmlFor="icon-button-file">
        <div style={{ display: "none" }}>Poster une image :</div>
        <IconButton title="image" label={label} color="primary" aria-label="upload picture" component="span">
          <PhotoCamera />
        </IconButton>
      </label>
    </div>
  );
}
