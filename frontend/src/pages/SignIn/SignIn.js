
import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState } from 'react';
import api from '../../config/api';


const SignIn = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onSignIn = async () => {
        try {
            const response = await api.post('/users/login', {
                email, password
            })
            sessionStorage.setItem('groupomaniaToken', response.data.token)
        } catch (error) {
            console.log('------------------------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }

    return <div>

        <Input onChange={onChangeEmail} value={email} label="Email" type="email" />
        <Input onChange={onChangePassword} value={password} label="password" type="password" />
        <Button onClick={onSignIn} title="Valider" />
    </div>
}
export default SignIn