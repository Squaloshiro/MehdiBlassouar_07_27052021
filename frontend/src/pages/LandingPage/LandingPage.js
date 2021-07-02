

import { useState, useEffect } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';
import "./landingpage.scss"
import LongMenu from '../../componants/Menu/Menu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageLike from '../../componants/MessageLike/MessageLike';

import MessageImage from '../PostMessage/PostMessage';

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


    const deleteOneMessage = (messageId) => {

        const idToRemove = messageId
        const filteredMessages = messages.filter((item) => item.id !== idToRemove);
        setMessages(filteredMessages)
    }

    const modifyLike = ({ messageId, like, dislike }) => {
        const newMessage = messages.filter((element) => {
            if (element.id === messageId) {
                element.likes = like
                element.dislikes = dislike
            }
            return element
        })
        setMessages(newMessage)
    }

    const postMessage = (newMessages) => {

        setMessages(newMessages)

    }

    const viewUpdateMessage = (updateMessages) => {
        setMessages(updateMessages)
    }

    return <div className="flex-position">
        <MessageImage postMessage={postMessage} />

        {messages && messages.map((element) => {

            return <div key={element.id} className='card-position'>
                <div className="f-card">
                    <div className="header">
                        <div className="options"><LongMenu element={element} viewUpdateMessage={viewUpdateMessage} deleteOneMessage={deleteOneMessage} messageId={element.id} /></div>
                        <img className="co-logo" alt="img" src="http://placehold.it/40x40" />
                        <div className="co-name"><a href="#">{element.User.username}</a></div>
                        <div className="time"><p>{element.createdAt}</p>  · <FontAwesomeIcon icon={['fas', 'globe']} /> </div>
                    </div>
                    <div className="content">
                        <p>{element.title} </p>
                    </div>
                    {element.attachment ?
                        <div className="reference">
                            <img alt="img" className="reference-thumb" src={element.attachment} />
                            <div className="reference-content">
                                <div className="reference-subtitle">{element.content}</div>
                                <div className="reference-font">Groupomania</div>
                            </div>
                        </div>
                        :
                        <div className="reference">
                            <div className="reference-content">
                                <div className="reference-subtitle">{element.content}</div>
                                <div className="reference-font">Groupomania</div>
                            </div>
                        </div>
                    }
                    <div className="social">
                        <div className="social-content"></div>
                        <div className="social-buttons">
                            <span><MessageLike modifyLike={modifyLike} messageId={element.id} like={element.likes} dislike={element.dislikes} /></span>
                            <span><FontAwesomeIcon icon={['far', 'comment']} />{element.comments}</span>
                        </div>
                    </div>
                </div>
            </div>

        })}
    </div >
}
export default LandingPage