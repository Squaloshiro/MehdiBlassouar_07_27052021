import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';

const SignUp = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const history = useHistory()

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onSignUp = async () => {
        try {
            const response = await api.post('/users/register', {
                email, password, username
            })
            sessionStorage.setItem('groupomaniaToken', response.data.token)
            history.push("/")
        } catch (error) {
            console.log('------------------------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }

    return <div>

        <Input onChange={onChangeEmail} value={email} label="Email" type="email" />
        <Input onChange={onChangePassword} value={password} label="password" type="password" />
        <Input onChange={onChangeUsername} value={username} label="Username" />
        <Button onClick={onSignUp} title="Valider" />
    </div>
}
export default SignUp