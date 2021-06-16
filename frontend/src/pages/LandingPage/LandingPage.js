import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState, useEffect } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';

const LandingPage = () => {
    const history = useHistory()
    const [messages, setMessages] = useState([])


    useEffect(() => {

        if (sessionStorage.getItem('groupomaniaToken')) {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            console.log('------------------------------------');
            console.log(token);
            console.log('------------------------------------');
            const getMessageApi = async () => {
                try {
                    const response = await api({

                        method: 'get',
                        url: '/messages',
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setMessages(response.data)
                    console.log('------------------------------------');
                    console.log(response);
                    console.log('------------------------------------');
                } catch (error) {
                    console.log('------------------------------------');
                    console.log(error);
                    console.log('------------------------------------');
                    history.push("/connexion")
                }
            }

            getMessageApi()
        } else {
            history.push("/connexion")
        }



    }, [history])




    return <div>

        {messages && messages.map((element) => {
            return <div key={element.id}>{element.title} {element.content} {element.UserId}</div>
        })}
    </div>
}
export default LandingPage