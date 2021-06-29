

import api from '../../config/api';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const MessageDestroy = ({ messageId }) => {
    const history = useHistory()





    const destroyMessage = async () => {

        try {
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            const response = await api({
                method: 'delete',
                url: '/messages/' + messageId,
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
            })

            history.push("/")
        } catch (error) {
            console.log('---------------123---------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }

    return <div onClick={destroyMessage}>Supprimer</div>

}
export default MessageDestroy