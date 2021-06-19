import React from 'react';
import "./header.scss";
import logo from '../../assets/logos/icon-left-font.png'
import Button from '../Button/Button';
import { useHistory } from 'react-router-dom';


const Header = ({ isLoggedin, setIsLoggedin }) => {

    const history = useHistory()

    const onLogout = () => {

        setIsLoggedin(false)
        sessionStorage.removeItem('groupomaniaToken')
        history.push('/connexion')
    }

    return <div className='lmj-banner flex'>
        <div className='image-rognage'>
            <img src={logo} alt='Groupomania' className='lmj-logo' />
        </div>

        {isLoggedin ? <Button onClick={onLogout} title="Déconexion" /> : <Button onClick={() => history.push('/inscription')} title="Inscription" />
        }

    </div>
}
export default Header