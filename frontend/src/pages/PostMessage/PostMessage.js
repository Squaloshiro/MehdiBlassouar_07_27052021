import Input from "../../componants/Input/Input";
import InputFile from "../../componants/InputFile/InputFile";
import Button from "../../componants/Button/Button";
import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import FormData from "form-data";
import TextArea from "../../componants/TextArea/InputTextArea";
import { toastTrigger } from "../../helper/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postmessage.scss";

const MessageImage = ({ postMessage }) => {
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
  const [activeImage, setActiveImage] = useState(false);
  const [activeError, setActiveError] = useState(false);
  const send = <FontAwesomeIcon title="Envoyer" aria-hidden="true" icon={["fas", "paper-plane"]} />;

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
    if (file === undefined) {
      setActiveImage(false);
      toastTrigger("success", "Image retirée");
    }
  }, [compteurTitle, compteurContent, file]);

  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      if (activeImage || compteurContent || compteurTitle || activeError) {
        setActiveError(false);
        setActiveImage(false);
        setFile("");
        setContent("");
        setTitle("");
        setCompteurTitle(0);
        setCompteurContent(0);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleOnUploadFile = (e) => {
    setFile(e.target.files[0]);

    setActiveImage(true);
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
      toastTrigger("error", "une erreur est survenue");
      return;
    }
    if (compteurContent > 2550) {
      toastTrigger("error", "une erreur est survenue");
      return;
    } else {
      if (title) {
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
            setActiveImage(false);
            setActiveError(false);
            setTheInputKey(Math.random().toString(36));

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
            setActiveError(false);

            toastTrigger("success", "Publication postée");
          }
        } catch (error) {
          if (!content && !file) {
            setActiveError(true);
          }
          toastTrigger("error", "une erreur est survenue");
        }
      } else {
        setActiveError(true);
        toastTrigger("error", "une erreur est survenue");
        return;
      }
    }
  };

  return (
    <div ref={myRef} className="post-cadre">
      <div className="post">
        <div>Exprimez-vous !</div>

        <Input style={{ width: "100%" }} onChange={onChangeTitle} label="Titre" value={title} />

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
          <InputFile label="Image" onChange={handleOnUploadFile} theInputKey={theInputKey} />
          <Button
            aria={{ "aria-label": "Text" }}
            alt="Envoyer"
            size="small"
            onClick={onSubmitMessageImg}
            title={send}
          />
        </div>
        {activeImage && <div className="img-file">{file?.name}</div>}
        {activeError && (
          <div className="error-call">* Un titre obligatoire et (une description ou une image ou les deux)</div>
        )}
      </div>
    </div>
  );
};
export default MessageImage;
