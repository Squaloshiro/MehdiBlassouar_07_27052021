import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';
import FormData from 'form-data'
import TextArea from '../../componants/TextArea/InputTextArea';

import "./postmessage.scss"


const MessageImage = ({ postMessage }) => {

    const history = useHistory()

    const [file, setFile] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')


    const handleOnUploadFile = (e) => {
        console.log(e.target.files[0])
        setFile(e.target.files[0])
    }

    const onChangeTitle = (e) => {
        console.log(e.target.title)
        setTitle(e.target.value)
    }

    const onChangeContent = (e) => {
        console.log(e.target.content)
        setContent(e.target.value)
    }

    const onSubmitMessageImg = async (e) => {
        e.preventDefault();

        const obj = { title, content }
        const json = JSON.stringify(obj)
        const formData = new FormData();


        formData.append("image", file);
        formData.append("message", json)
        try {
            if (file) {
                const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
                const response = await api({
                    method: 'post',
                    url: '/messages/newimg/',
                    data: formData,
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
                })


                postMessage(response.data)
                history.push("/")
            } else {
                const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
                const response = await api({
                    method: 'post',
                    url: '/messages/new/',
                    data: obj,
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
                })
                postMessage(response.data)
                history.push("/")
            }
        } catch (error) {
            console.log('------------------------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }


    return <div className='post-cadre'><div className='post'>
        <Input onChange={onChangeTitle} label='Titre' value={title} />
        <TextArea id="outlined-multiline-static"
            label="Text"
            rows={4}
            variant="outlined"
            onChange={onChangeContent}
            placeholder='Text'
            value={content} />
        <div className='file-button'>
            <Input type="file" onChange={handleOnUploadFile} label='Image' />
            <Button size="small" onClick={onSubmitMessageImg} title='Envoyer' />
        </div>
    </div></div>
}
export default MessageImage