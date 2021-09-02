import TextField from "@material-ui/core/TextField";

const Input = ({ style, value, onChange, label, type = "text", theInputKey }) => {
  return (
    <TextField style={style} value={value} onChange={onChange} label={label} type={type} key={theInputKey || ""} />
  );
};
export default Input;
