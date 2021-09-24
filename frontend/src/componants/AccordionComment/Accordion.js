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
import moment from "moment";

const Accordion = ({ title, comments, setcomments, messageId, modifyComment, newComments, myUserId, admin }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const history = useHistory();
  const [messageInModal, setMessageInModal] = useState(null);
  const [messageInModalDestroy, setMessageInModalDestroy] = useState(null);
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);
  //const [comments, setcomments] = useState([]);
  const [activeHide, setActiveHide] = useState(false);

  const deleteOneComment = (commentId) => {
    const idToRemove = commentId;
    const filteredMessages = comments.filter((item) => item.id !== idToRemove);
    setcomments(filteredMessages);
  };

  const modifyCommentLike = ({ commentsId, like, dislike, userLike, userDislike }) => {
    const newComments = comments.filter((element) => {
      if (element.id === commentsId) {
        element.likes = like;
        element.dislikes = dislike;
        const messageCommentLikeByCurrentUser = element?.Commentlikes?.filter((elt) => myUserId === elt.userId);
        if (messageCommentLikeByCurrentUser?.length) {
          messageCommentLikeByCurrentUser[0].userLike = userLike;
          messageCommentLikeByCurrentUser[0].userDislike = userDislike;
        }
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
  const openPopUp = () => {
    if (!popUpIsOpen) {
      setPopUpIsOpen(true);
    }
  };

  const openModal = (comment) => {
    setMessageInModal(comment);
    setActiveHide(true);
    setActive(true);
  };
  const closeModal = () => {
    setActive(false);
    setMessageInModal(null);
    setMessageInModalDestroy(null);
  };
  const openModalDestroy = (messageId) => {
    setMessageInModalDestroy(messageId);
    setActiveHide(true);
    setActive(true);
  };

  return (
    <div className={`accordion ${open && "active"}`}>
      {active && messageInModal && (
        <Modal
          popUpIsOpen={popUpIsOpen}
          onClick={closeModal}
          activeHide={activeHide}
          setActive={setActive}
          active={active}
        >
          <CommentUpdate
            setPopUpIsOpen={setPopUpIsOpen}
            setActiveHide={setActiveHide}
            close={closeModal}
            setcomments={setcomments}
            element={messageInModal}
            setActive={setActive}
            admin={admin}
            openPopUp={openPopUp}
          />
        </Modal>
      )}
      {active && messageInModalDestroy && (
        <Modal
          popUpIsOpen={popUpIsOpen}
          onClick={closeModal}
          activeHide={activeHide}
          setActive={setActive}
          active={active}
        >
          <DestroyComment
            setPopUpIsOpen={setPopUpIsOpen}
            setActiveHide={setActiveHide}
            setActive={setActive}
            close={closeModal}
            modifyComment={modifyComment}
            newComments={newComments}
            commentsId={messageInModalDestroy}
            messageId={messageId}
            deleteOneComment={deleteOneComment}
            admin={admin}
            openPopUp={openPopUp}
          />
        </Modal>
      )}
      <div className="accordion__title" onClick={handleToggle}>
        {title} <span className="accordion__icon"></span>
      </div>
      <div className="accordion__content">
        <div className="flex-position-comment">
          {comments[0] !== undefined ? (
            comments.map((element) => {
              const messageCommentLikeByCurrentUser = element?.Commentlikes?.filter((elt) => myUserId === elt.userId);
              const lastNameFirstName = element.User.lastName + " " + element.User.firstName;

              return (
                <div key={element.id} className="card-position-comment">
                  <div className="f-card-comment">
                    <div className="header-comment">
                      <img className="co-logo-comment" alt="" src={element.User.avatar} />
                      <div className="co-name-comment">
                        <div onClick={() => redirectToUserProfil(element.UserId)}>{lastNameFirstName}</div>

                        {element.User.isAdmin === true ? (
                          <div onClick={() => redirectToUserProfil(element.UserId)}>Administrateur</div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="time-comment">
                        {element.createdAt === element.updatedAt ? (
                          <div>
                            <div className="post-color-2">
                              {" "}
                              Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                              <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="post-color-2">
                              {" "}
                              Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                              <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                            </div>
                            <div className="post-color-2">
                              {" "}
                              Modifié {moment(new Date(element.updatedAt)).fromNow()}{" "}
                              <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="content-comment">
                      <div>{element.content} </div>
                    </div>
                    <div className="social-comment">
                      <div className="social-buttons-comment">
                        <div className="button-like-comment">
                          <span>
                            <CommentLike
                              messageCommentLikeByCurrentUser={messageCommentLikeByCurrentUser}
                              modifyCommentLike={modifyCommentLike}
                              commentsId={element.id}
                              like={element.likes}
                              dislike={element.dislikes}
                            />
                          </span>
                        </div>
                        <div className="button-updat-comment">
                          <span>
                            {(element.UserId === myUserId || admin === true) && (
                              <div>
                                <FontAwesomeIcon
                                  color="blue"
                                  icon={["fas", "edit"]}
                                  onClick={(e) => openModal(element)}
                                />
                              </div>
                            )}
                          </span>
                          <span>
                            {(element.UserId === myUserId || admin === true) && (
                              <FontAwesomeIcon
                                color="red"
                                icon={["fas", "trash-alt"]}
                                onClick={(e) => openModalDestroy(element.id)}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="not-comment">Pas de commentaire</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
