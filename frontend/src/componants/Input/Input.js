import TextField from "@material-ui/core/TextField";

const Input = ({ style, value, onChange, label, type = "text", theInputKey, aria }) => {
  return (
    <label>
      <TextField
        style={style}
        value={value}
        onChange={onChange}
        aria-label={aria}
        aria-required="true"
        label={label}
        type={type}
        key={theInputKey || ""}
      />
    </label>
  );
};
export default Input;
