import MaterialButton from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Button = ({ size, type = "submit", alt, title, onClick, style, aria }) => {
  const classes = useStyles();
  return (
    <MaterialButton
      alt={alt}
      aria-label={aria}
      size={size}
      style={style}
      className={classes.margin}
      type={type}
      onClick={onClick}
      variant="contained"
      color="primary"
    >
      {title}
    </MaterialButton>
  );
};
export default Button;
