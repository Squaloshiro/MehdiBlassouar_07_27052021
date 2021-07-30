import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState } from "react";

const Update = ({ viewUpdateMessage, element }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
    } catch (error) {}
  };

  return (
    <div key={element.id}>
      <Button color="primary" onClick={handleClickOpen} title="Modifier" />

      {open && (
        <div className="modal" id="modal">
          <div className="modal-content">
            <div className="modal-hide" onClick={handleClose}>
              ✕
            </div>
            <div className="styl">
              <div onClose={handleClose} className="test1000" aria-labelledby="customized-dialog-title" open={open}>
                <div id="customized-dialog-title" onClose={handleClose}>
                  Modifier votre publication
                </div>
                <div className="card-position">
                  <div>
                    <div>
                      <img className="co-logo" alt="img" src="http://placehold.it/40x40" />
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
                            <Input onChange={onChangeContent} value={content} label={element.title}></Input>
                          </div>
                          <div className="reference-font">Groupomania</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Button onClick={updateMessage} color="primary">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
