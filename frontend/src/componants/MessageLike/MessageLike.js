

import api from '../../config/api';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const MessageLike = ({ modifyLike, messageId, like, dislike }) => {
    const history = useHistory()



    const onSubmitLikeMessage = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            const response = await api({
                method: 'post',
                url: '/messages/' + messageId + '/vote/like',
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
            })
            if (response.data === 'like ajoutée') {
                like = like + 1
            } else if (response.data === 'like ajoutée, dislike retirée') {
                like = like + 1
                dislike = dislike - 1
            } else if (response.data === 'like retirée') {

                like = like - 1


            }
            modifyLike({ messageId, like, dislike })

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

            if (response.data === 'dislike ajoutée') {
                dislike = dislike + 1

            } else if (response.data === 'dislike ajoutée, like retirée') {
                dislike = dislike + 1
                like = like - 1
            } else if (response.data === 'dislike retirée') {
                dislike = dislike - 1

            }
            modifyLike({ messageId, dislike, like })

            history.push("/")
        } catch (error) {
            console.log('---------------123---------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }





    return <div><span ><FontAwesomeIcon icon={['far', 'thumbs-up']} onClick={onSubmitLikeMessage} />{like}</span>
        <span ><FontAwesomeIcon icon={['far', 'thumbs-down']} onClick={onSubmitDislikeMessage} />{dislike}</span></div>







}
export default MessageLike