import MaterialButton from '@material-ui/core/Button';

const Button = ({ type='submit',title, onClick }) => {
    return <MaterialButton type={type} onClick={onClick} variant="contained" color="primary">
        {title}
    </MaterialButton>
}
export default Button