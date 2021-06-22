
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

            return <div key={element.id} className='card-position'>
                <div className="f-card">
                    <div className="header">
                        <div className="options"><i className="fa fa-chevron-down"></i></div>
                        <img className="co-logo" src="http://placehold.it/40x40" />
                        <div className="co-name"><a href="#">{element.User.username}</a></div>
                        <div className="time"><a href="#">{element.createdAt}</a> · <i className="fa fa-globe"></i></div>
                    </div>
                    <div className="content">
                        <p>{element.title} </p>
                    </div>

                    <div className="reference">
                        <img className="reference-thumb" src={element.attachment} />
                        <div className="reference-content">

                            <div className="reference-subtitle">{element.content}</div>
                            <div className="reference-font">Groupomania</div>
                        </div>
                    </div>
                    <div className="social">
                        <div className="social-content"></div>
                        <div className="social-buttons">
                            <span><i className="fa fa-thumbs-up"></i>Like</span>
                            <span><i className="fa fa-thumbs-up"></i>Dislike</span>
                            <span><i className="fa fa-comment"></i>Comment</span>
                        </div>
                    </div>
                </div>
            </div>

        })}
    </div>
}
export default LandingPage