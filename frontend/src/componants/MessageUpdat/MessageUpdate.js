import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState, useEffect } from "react";
import { toastTrigger } from "../../helper/toast";
import { useLocation } from "react-router";
import TextArea from "../TextArea/InputTextArea";
const MessageUpdate = ({
  viewUpdateMessage,
  setActive,
  element,
  setPopUpIsOpen,
  onClick,
  myUserId,
  setMessagesUser,
  id,
}) => {
  const [title, setTitle] = useState(element.title);
  const [content, setContent] = useState(element.content);
  const location = useLocation();
  const [classNameTitle, setClassNameTitle] = useState("color_black");
  const [classNameContent, setClassNameContent] = useState("color_black");
  const [compteurContent, setCompteurContent] = useState(0);
  const [compteurTitle, setCompteurTitle] = useState(0);
  const [maxTitle, setmaxTitle] = useState("");
  const [maxContent, setmaxContent] = useState("");

  useEffect(() => {
    if (compteurTitle > 255) {
      setClassNameTitle("color_red");
      setmaxTitle("atteind");
    } else {
      setClassNameTitle("color_black");
      setmaxTitle("");
    }
    if (compteurContent > 2550) {
      setClassNameContent("color_red");
      setmaxContent("atteind");
    } else {
      setClassNameContent("color_black");
      setmaxContent("");
    }
  }, [compteurTitle, compteurContent]);

  const handleClose = () => {
    setPopUpIsOpen(false);
    onClick();
  };

  const onChangeTitle = (e) => {
    setCompteurTitle(e.target.value.length);
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setCompteurContent(e.target.value.length);
    setContent(e.target.value);
  };

  const updateMessage = async () => {
    const obj = { title, content };
    if (title === "" || content === "" || (title === element.title && content === element.content)) {
      setActive(false);
      toastTrigger("error", "une erreur est survenu");
      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/messages/" + element.id,
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setCompteurTitle(0);
      setCompteurContent(0);
      if (location.pathname === "/profil" || location.pathname === "/users/profils") {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

        try {
          const response = await api({
            method: "get",
            url: myUserId ? `/messages/${myUserId}` : `/messages/${id}`,
            headers: { Authorization: `Bearer ${token}` },
          });

          setMessagesUser(response.data);
        } catch (error) {
          toastTrigger("error", "une erreur est survenu");
        }
        setActive(false);
        toastTrigger("success", "Publication modifiée");
      } else {
        viewUpdateMessage(response.data);
        setActive(false);
        toastTrigger("success", "Publication modifiée");
      }
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div className="new-position" key={element.id}>
      <div onClose={handleClose}>
        <div>
          <img className="co-logo-update" alt="img" src={element.User.avatar} />
          <div className="co-name">
            <div>{element.User.username}</div>
            {element.User.isAdmin === true ? <div>Administrateur</div> : <></>}
          </div>
          <div className="time">
            {element.createdAt === element.updatedAt ? (
              <div>
                <div>
                  {" "}
                  Le {element.createdAt} <FontAwesomeIcon icon={["fas", "globe"]} />
                </div>
              </div>
            ) : (
              <div>
                <div>
                  {" "}
                  Modifié le {element.updatedAt} <FontAwesomeIcon icon={["fas", "globe"]} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="content">
          <Input onChange={onChangeTitle} value={title} label="title"></Input>
          {compteurTitle > 0 && (
            <div className={classNameTitle}>
              Limite de caractère {maxTitle} : {compteurTitle}/255
            </div>
          )}
        </div>
        {element.attachment ? (
          <div className="reference">
            <img alt="img" className="reference-thumb" src={element.attachment} />
            <div className="reference-content">
              <div className="reference-subtitle">
                <TextArea
                  style={{ width: "98.3%" }}
                  onChange={onChangeContent}
                  value={content}
                  rows={4}
                  variant="outlined"
                  label="Comment"
                  placeholder="content"
                ></TextArea>
                {compteurContent > 0 && (
                  <div className={classNameContent}>
                    Limite de caractère {maxContent} : {compteurContent}/2550
                  </div>
                )}
              </div>
              <div className="reference-font">Groupomania</div>
            </div>
          </div>
        ) : (
          <div className="reference">
            <div className="reference-content">
              <div className="reference-subtitle">
                <TextArea
                  style={{ width: "98.3%" }}
                  onChange={onChangeContent}
                  value={content}
                  rows={4}
                  variant="outlined"
                  label="Comment"
                  placeholder="content"
                ></TextArea>
                {compteurContent > 0 && (
                  <div className={classNameContent}>
                    Limite de caractère {maxContent} : {compteurContent}/2550
                  </div>
                )}
              </div>
              <div className="reference-font">Groupomania</div>
            </div>
          </div>
        )}
      </div>

      <Button autoFocus onClick={updateMessage} color="primary" title="Modifier" />
    </div>
  );
};

export default MessageUpdate;
