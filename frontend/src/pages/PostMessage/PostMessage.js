import Input from '../../componants/Input/Input';
import Button from '../../componants/Button/Button';
import { useState } from 'react';
import api from '../../config/api';
import { useHistory } from 'react-router';
import FormData from 'form-data'
import TextArea from '../../componants/TextArea/InputTextArea';



const MessageImage = () => {
    const history = useHistory()

    const [file, setFile] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')


    const handleOnUploadFile = (e) => {
        console.log(e.target.files[0])
        setFile(e.target.files[0])
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeContent = (e) => {
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
            const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));
            await api({

                method: 'post',
                url: '/messages/newimg/',
                data: formData,
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", 'Content-Type': "multipart/from-data" }
            })

            history.push("/")
        } catch (error) {
            console.log('------------------------------------');
            console.log(error);
            console.log('------------------------------------');
        }
    }

    return <div>
        <Input onChange={onChangeTitle} label='Titre' value={title} />
        <TextArea onChange={onChangeContent} placeholder='Text' value={content} />
        <Input type="file" onChange={handleOnUploadFile} label='Image' />
        <Button onClick={onSubmitMessageImg} title='Envoyer' />
    </div>
}
export default MessageImage