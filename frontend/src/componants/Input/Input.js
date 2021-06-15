import TextField from '@material-ui/core/TextField';

const Input = ({ value, onChange, label, type = "text" }) => {

    return <TextField value={value} onChange={onChange} label={label} type={type} />

}
export default Input