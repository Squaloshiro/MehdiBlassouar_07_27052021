

import api from '../../config/api';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const MessageLike = ({ messageId, like, dislike }) => {
    const history = useHistory()
    const [userLike, setUserLike] = useState()
    const [userDislike, setUserDislike] = useState()


    const viewLike = () => {
        if (userLike === undefined) {

            return like
        } else {

            return userLike
        }
    }

    const viewDislike = () => {
        if (userDislike === undefined) {

            return dislike
        } else {

            return userDislike
        }
    }


    const onSubmitLikeMessage = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            const response = await api({
                method: 'post',
                url: '/messages/' + messageId + '/vote/like',
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
            })
            setUserLike(response.data.likes)
            setUserDislike(response.data.dislikes)
            history.push("/")
        } catch (error) {
            console.log('---------------123---------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }

    const onSubmitDislikeMessage = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            const response = await api({
                method: 'post',
                url: '/messages/' + messageId + '/vote/dislike',
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
            })

            setUserDislike(response.data.dislikes)
            setUserLike(response.data.likes)
            history.push("/")
        } catch (error) {
            console.log('---------------123---------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }





    return <div><span ><FontAwesomeIcon icon={['far', 'thumbs-up']} onClick={onSubmitLikeMessage} />{viewLike()}</span>
        <span ><FontAwesomeIcon icon={['far', 'thumbs-down']} onClick={onSubmitDislikeMessage} />{viewDislike()}</span></div>







}
export default MessageLike