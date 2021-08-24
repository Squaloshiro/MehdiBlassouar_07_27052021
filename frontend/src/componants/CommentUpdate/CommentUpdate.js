import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../pages/LandingPage/landingpage.scss";
import "../../componants/MessageUpdat/update.scss";
import api from "../../config/api";
import { useState } from "react";
import { toastTrigger } from "../../helper/toast";

const CommentUpdate = ({ setcomments, setActive, element, close }) => {
  const [content, setContent] = useState(element.content);

  const onChangeContent = (e) => {
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
      close();
      toastTrigger("success", "Commentair modfié");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div key={element.id} className="card-position">
      <div className="f-card">
        <div className="header">
          <div className="options"></div>
          <img className="co-logo" alt="img" src={element.User.avatar} />
          <div className="co-name">
            <div>{element.User.username}</div>
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
          <Input onChange={onChangeContent} value={content} label="content"></Input>
        </div>
        <div className="social">
          <div className="social-content"></div>
          <div className="social-buttons"></div>
        </div>
      </div>
      <Button autoFocus onClick={updateComment} color="primary" title="Modifier" />
    </div>
  );
};

export default CommentUpdate;
