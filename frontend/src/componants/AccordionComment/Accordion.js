import React from "react";
import { useState } from "react";
import "../AccordionComment/accordion.scss";
import api from "../../config/api";
import { useHistory } from "react-router";
import DestroyComment from "../DestroyComment/DestroyComment";
import CommentUpdate from "../CommentUpdate/CommentUpdate";
import CommentLike from "../CommentLike/Commentlike";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../componants/Modal/Modal";

const Accordion = ({ title, comments, setcomments, messageId, modifyComment, newComments, myUserId, admin }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const history = useHistory();
  const [messageInModal, setMessageInModal] = useState(null);
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
        setOpen(!open);
      } catch (error) {
        history.push("/connexion");
      }
    } else {
      history.push("/connexion");
    }
  };
  const openModal = (comment) => {
    setMessageInModal(comment);
    setActive(true);
  };
  const closeModal = () => {
    setActive(false);
  };
  return (
    <div className={`accordion ${open && "active"}`}>
      {active && messageInModal && (
        <Modal setActive={setActive} active={active}>
          <CommentUpdate
            close={closeModal}
            setcomments={setcomments}
            element={messageInModal}
            setActive={setActive}
            admin={admin}
          />
        </Modal>
      )}
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
                            <div>
                              <FontAwesomeIcon color="red" icon={["fas", "edit"]} onClick={(e) => openModal(element)} />
                            </div>
                          ) : (
                            <></>
                          )}
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
