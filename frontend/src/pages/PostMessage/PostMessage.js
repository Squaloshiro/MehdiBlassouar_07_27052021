import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import FormData from "form-data";
import TextArea from "../../componants/TextArea/InputTextArea";
import { toastTrigger } from "../../helper/toast";
import "./postmessage.scss";

const MessageImage = ({ postMessage }) => {
  const history = useHistory();

  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theInputKey, setTheInputKey] = useState("");

  const handleOnUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onSubmitMessageImg = async (e) => {
    e.preventDefault();

    const obj = { title, content };
    const json = JSON.stringify(obj);
    const formData = new FormData();

    formData.append("image", file);
    formData.append("message", json);

    if (title && content) {
      try {
        if (file) {
          const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
          const response = await api({
            method: "post",
            url: "/messages/newimg/",
            data: formData,
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "multipart/from-data",
            },
          });

          postMessage(response.data);
          setTitle("");
          setContent("");
          setFile("");

          setTheInputKey(Math.random().toString(36));
          history.push("/");
          toastTrigger("success", "Publication postée");
        } else {
          const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
          const response = await api({
            method: "post",
            url: "/messages/new/",
            data: obj,
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          setTitle("");
          setContent("");
          postMessage(response.data);
          history.push("/");
          toastTrigger("success", "Publication postée");
        }
      } catch (error) {
        toastTrigger("error", "une erreur est survenu");
      }
    } else {
      toastTrigger("error", "une erreur est survenu");
      return;
    }
  };

  return (
    <div className="post-cadre">
      <div className="post">
        <Input onChange={onChangeTitle} label="Titre" value={title} />
        <TextArea
          id="outlined-multiline-static"
          label="Text"
          rows={4}
          variant="outlined"
          onChange={onChangeContent}
          placeholder="Text"
          value={content}
        />
        <div className="file-button">
          <Input type="file" onChange={handleOnUploadFile} theInputKey={theInputKey} />
          <Button size="small" onClick={onSubmitMessageImg} title="Envoyer" />
        </div>
      </div>
    </div>
  );
};
export default MessageImage;
