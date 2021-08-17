import TextField from "@material-ui/core/TextField";

const Input = ({ value, onChange, label, type = "text", theInputKey }) => {
  return <TextField value={value} onChange={onChange} label={label} type={type} key={theInputKey || ""} />;
};
export default Input;
