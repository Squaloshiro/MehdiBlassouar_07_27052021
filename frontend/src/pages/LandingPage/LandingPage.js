import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState, useEffect } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';
import "./landingpage.scss"

const LandingPage = () => {
    const history = useHistory()
    const [messages, setMessages] = useState([])


    useEffect(() => {

        if (sessionStorage.getItem('groupomaniaToken')) {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));

            const getMessageApi = async () => {
                try {
                    const response = await api({

                        method: 'get',
                        url: '/messages',
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setMessages(response.data)

                } catch (error) {

                    history.push("/connexion")
                }
            }

            getMessageApi()
        } else {
            history.push("/connexion")
        }



    }, [history])




    return <div className="flex-position">
        <Button onClick={() => history.push('/post-message')} title='go post mess' />

        {messages && messages.map((element) => {
            console.log('------------------------------------');
            console.log(element);
            console.log('------------------------------------');
            return <div key={element.id} className='card-position'>
                <div className='user-position'>
                    <div className='avatar-position'>mon avatar</div>
                    <div className='username-position'>
                        <div>{element.User.username}</div>
                        <div>{element.createdAt}</div>
                    </div>
                </div>

                <div className='img-position'>
                    <img className='img-size' src={element.attachment}
                        alt="publication image user" />
                </div>
                <div className='title-position'>{element.title} </div>
                <div className="content-position">
                    <div className='text-position' >{element.content} </div>
                </div>
            </div>
        })}
    </div>
}
export default LandingPage