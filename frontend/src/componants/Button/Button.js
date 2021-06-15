import MaterialButton from '@material-ui/core/Button';

const Button = ({ title, onClick }) => {
    return <MaterialButton onClick={onClick} variant="contained" color="primary">
        {title}
    </MaterialButton>
}
export default Button