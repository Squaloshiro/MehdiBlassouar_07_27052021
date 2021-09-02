import Input from "../../componants/Input/Input";
import InputFile from "../../componants/InputFile/InputFile";
import Button from "../../componants/Button/Button";
import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import FormData from "form-data";
import TextArea from "../../componants/TextArea/InputTextArea";
import { toastTrigger } from "../../helper/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postmessage.scss";

const MessageImage = ({ postMessage }) => {
  const history = useHistory();
  const [compteurContent, setCompteurContent] = useState(0);
  const [compteurTitle, setCompteurTitle] = useState(0);
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theInputKey, setTheInputKey] = useState("");
  const [classNameTitle, setClassNameTitle] = useState("color-green");
  const [classNameContent, setClassNameContent] = useState("color-green");
  const [maxTitle, setmaxTitle] = useState("");
  const [maxContent, setmaxContent] = useState("");
  const send = <FontAwesomeIcon icon={["fas", "paper-plane"]} />;

  useEffect(() => {
    if (compteurTitle > 255) {
      setClassNameTitle("color_red");
      setmaxTitle("atteind");
    } else {
      setClassNameTitle("color-green");
      setmaxTitle("");
    }
    if (compteurContent > 2550) {
      setClassNameContent("color_red");
      setmaxContent("atteind");
    } else {
      setClassNameContent("color-green");
      setmaxContent("");
    }
  }, [compteurTitle, compteurContent]);

  const handleOnUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onChangeTitle = (e) => {
    setCompteurTitle(e.target.value.length);
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setCompteurContent(e.target.value.length);
    setContent(e.target.value);
  };

  const onSubmitMessageImg = async (e) => {
    e.preventDefault();

    const obj = { title, content };
    const json = JSON.stringify(obj);
    const formData = new FormData();

    formData.append("image", file);
    formData.append("message", json);
    if (compteurTitle > 255) {
      toastTrigger("error", "une erreur est survenu");
      return;
    }
    if (compteurContent > 2550) {
      toastTrigger("error", "une erreur est survenu");
      return;
    } else {
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
            setCompteurTitle(0);
            setContent("");
            setCompteurContent(0);
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
            setCompteurTitle(0);
            setContent("");
            setCompteurContent(0);
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
    }
  };

  return (
    <div className="post-cadre">
      <div className="post">
        <Input onChange={onChangeTitle} label="Titre" value={title} />
        {compteurTitle > 0 && (
          <div className={classNameTitle}>
            Limite de caractère {maxTitle} : {compteurTitle}/255
          </div>
        )}

        <TextArea
          style={{ width: "98.3%" }}
          label="Text"
          rows={4}
          variant="outlined"
          onChange={onChangeContent}
          placeholder="Text"
          value={content}
        />

        {compteurContent > 0 && (
          <div className={classNameContent}>
            Limite de caractère {maxContent} : {compteurContent}/2550
          </div>
        )}

        <div className="file-button">
          <InputFile onChange={handleOnUploadFile} theInputKey={theInputKey} />
          <Button size="small" onClick={onSubmitMessageImg} title={send} />
        </div>
      </div>
    </div>
  );
};
export default MessageImage;
