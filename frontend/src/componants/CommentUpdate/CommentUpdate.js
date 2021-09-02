import React from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState, useEffect } from "react";
import { toastTrigger } from "../../helper/toast";
import TextArea from "../TextArea/InputTextArea";

const CommentUpdate = ({ setPopUpIsOpen, setcomments, setActive, element, close }) => {
  const [content, setContent] = useState(element.content);
  const [compteurContent, setCompteurContent] = useState(0);
  const [maxContent, setmaxContent] = useState("");
  const [classNameContent, setClassNameContent] = useState("color-green");
  const send = <FontAwesomeIcon icon={["fas", "paper-plane"]} />;

  useEffect(() => {
    if (compteurContent > 1000) {
      setClassNameContent("color_red");
      setmaxContent("atteind");
    } else {
      setClassNameContent("color-green");
      setmaxContent("");
    }
  }, [compteurContent]);

  const handleClose = () => {
    setPopUpIsOpen(false);
    close();
  };

  const onChangeContent = (e) => {
    setCompteurContent(e.target.value.length);
    setContent(e.target.value);
  };

  const updateComment = async () => {
    const obj = { content };
    if (content === "" || content === element.content) {
      setActive(false);
      toastTrigger("error", "une erreur est survenu");
      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/comment/" + element.id,
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setcomments(response.data);
      setCompteurContent(0);
      close();
      toastTrigger("success", "Commentair modfié");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div key={element.id} className="card-position-comment-2">
      <div onClose={handleClose} className="f-card">
        <div className="header">
          <div className="options"></div>
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
          <TextArea
            style={{ width: "98.3%" }}
            label="Comment"
            rows={2}
            variant="outlined"
            onChange={onChangeContent}
            placeholder="Text"
            value={content}
          />
          {compteurContent > 0 && (
            <div className={classNameContent}>
              Limite de caractère {maxContent} : {compteurContent}/1000
            </div>
          )}
        </div>
        <div className="social">
          <div className="social-content"></div>
          <div className="social-buttons"></div>
        </div>
      </div>
      <Button autoFocus onClick={updateComment} color="primary" title={send} />
    </div>
  );
};

export default CommentUpdate;
