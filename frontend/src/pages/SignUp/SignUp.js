import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';
import "./signup.scss";


const SignUp = ({ isLoggedin, setIsLoggedin }) => {

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
            setIsLoggedin(true)
            history.push("/")

        } catch (error) {

        }


    }



    return <div className='lmj-main'>
        <div className="lmj-flex">
            <div className='element-size'>
                <Input onChange={onChangeEmail} value={email} label="Email" type="email" />
            </div>
            <div className='element-marge  element-size'>
                <Input onChange={onChangePassword} value={password} label="Password" type="password" />
            </div>
            <div className='element-marge  element-size'>
                <Input onChange={onChangeUsername} value={username} label="Username" />
            </div>
            <div className='element-marge'>
                <Button onClick={onSignUp} title="Valider" />
            </div>
        </div>

    </div>

}


export default SignUp