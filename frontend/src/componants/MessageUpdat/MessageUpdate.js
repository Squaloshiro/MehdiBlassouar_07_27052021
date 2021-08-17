import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState } from "react";
import { toastTrigger } from "../../helper/toast";
import { useLocation } from "react-router";
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

  const handleClose = () => {
    setPopUpIsOpen(false);
    onClick();
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
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
          <img className="co-logo" alt="img" src={element.User.avatar} />
          <div className="co-name">
            <div>{element.User.username}</div>
          </div>
          <div className="time">
            <div>{element.createdAt}</div> · <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
          </div>
        </div>
        <div className="content">
          <Input onChange={onChangeTitle} value={title} label="title"></Input>
        </div>
        {element.attachment ? (
          <div className="reference">
            <img alt="img" className="reference-thumb" src={element.attachment} />
            <div className="reference-content">
              <div className="reference-subtitle">
                <Input onChange={onChangeContent} value={content} label="content"></Input>
              </div>
              <div className="reference-font">Groupomania</div>
            </div>
          </div>
        ) : (
          <div className="reference">
            <div className="reference-content">
              <div className="reference-subtitle">
                <Input onChange={onChangeContent} value={content} label="content"></Input>
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
