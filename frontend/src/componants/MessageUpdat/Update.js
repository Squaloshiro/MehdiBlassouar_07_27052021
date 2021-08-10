import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState } from "react";

const Update = ({ viewUpdateMessage, setActive, element, setPopUpIsOpen, openPopUp, onClick }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    openPopUp();
  };
  const handleClose = () => {
    setOpen(false);
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
    setOpen(false);
    const obj = { title, content };
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/messages/" + element.id,
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      viewUpdateMessage(response.data);
      setActive(false);
    } catch (error) {}
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
          <Input onChange={onChangeTitle} value={title} label={element.title}></Input>
        </div>
        {element.attachment ? (
          <div className="reference">
            <img alt="img" className="reference-thumb" src={element.attachment} />
            <div className="reference-content">
              <div className="reference-subtitle">
                <Input onChange={onChangeContent} value={content} label={element.title}></Input>
              </div>
              <div className="reference-font">Groupomania</div>
            </div>
          </div>
        ) : (
          <div className="reference">
            <div className="reference-content">
              <div className="reference-subtitle">
                <Input onChange={onChangeContent} value={content} label={element.content}></Input>
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

export default Update;
