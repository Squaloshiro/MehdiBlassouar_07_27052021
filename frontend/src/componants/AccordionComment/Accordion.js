import React from "react";
import { useState } from "react";
import "../AccordionComment/accordion.scss";
import api from "../../config/api";
import { useHistory } from "react-router";
import DestroyComment from "../DestroyComment/DestroyComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CommentLike from "../CommentLike/Commentlike";

const Accordion = ({ title, comments, setcomments, messageId, modifyComment, newComments, myUserId, admin }) => {
  const [active, setActive] = useState(false);
  const history = useHistory();
  //const [comments, setcomments] = useState([]);

  const deleteOneComment = (commentId) => {
    const idToRemove = commentId;
    const filteredMessages = comments.filter((item) => item.id !== idToRemove);
    setcomments(filteredMessages);
  };

  const modifyCommentLike = ({ commentsId, like, dislike }) => {
    const newComments = comments.filter((element) => {
      if (element.id === commentsId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setcomments(newComments);
  };

  const redirectToUserProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/users/profils", state: { id } });
    }
  };
  const handleToggle = async (e) => {
    if (sessionStorage.getItem("groupomaniaToken")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      try {
        const response = await api({
          method: "get",
          url: "/comment/" + messageId,
          headers: { Authorization: `Bearer ${token}` },
        });

        setcomments(response.data);
        setActive(!active);
      } catch (error) {
        history.push("/connexion");
      }
    } else {
      history.push("/connexion");
    }
  };
  return (
    <div className={`accordion ${active && "active"}`}>
      <div className="accordion__title" onClick={handleToggle}>
        {title} <span className="accordion__icon"></span>
      </div>
      <div className="accordion__content">
        <div className="flex-position">
          {comments &&
            comments.map((element) => {
              const messageCommentLikeByCurrentUser = element?.CommentsLikes?.filter((elt) => myUserId === elt.userId);
              return (
                <div key={element.id} className="card-position">
                  <div className="f-card">
                    <div className="header">
                      <div className="options"></div>
                      <img className="co-logo" alt="img" src={element.User.avatar} />
                      <div className="co-name">
                        <div onClick={() => redirectToUserProfil(element.UserId)}>{element.User.username}</div>
                      </div>
                      <div className="time">
                        <div>{element.createdAt}</div> · <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                      </div>
                    </div>
                    <div className="content">
                      <div>{element.content} </div>
                    </div>
                    <div className="social">
                      <div className="social-content"></div>
                      <div className="social-buttons">
                        <span>
                          <CommentLike
                            messageCommentLikeByCurrentUser={messageCommentLikeByCurrentUser}
                            modifyCommentLike={modifyCommentLike}
                            commentsId={element.id}
                            like={element.likes}
                            dislike={element.dislikes}
                          />
                        </span>
                        <span>
                          {element.UserId === myUserId || admin === true ? (
                            <DestroyComment
                              modifyComment={modifyComment}
                              newComments={newComments}
                              commentsId={element.id}
                              messageId={messageId}
                              deleteOneComment={deleteOneComment}
                              admin={admin}
                            />
                          ) : (
                            <></>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
