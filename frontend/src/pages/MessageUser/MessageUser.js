import { useState, useEffect } from "react";
import api from "../../config/api";
import Menu from "../../componants/Menu/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageLike from "../../componants/MessageLike/MessageLike";
import { toastTrigger } from "../../helper/toast";
import PostComment from "../../componants/PostComment/PostComment";
import Modal from "../../componants/Modal/Modal";
import MessageUpdate from "../../componants/MessageUpdat/MessageUpdate";
import moment from "moment";

import "./messageuser.scss";
import MessageDestroy from "../../componants/DestroyMsg/DestroyMsg";
const MessageUser = ({ id, messagesUser, setMessagesUser, myUserId, admin, isAdmin, avatar }) => {
  const [active, setActive] = useState(false);
  const [messageInModal, setMessageInModal] = useState(null);
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);
  const [messageInModalDestroy, setMessageInModalDestroy] = useState(null);
  const [activeHide, setActiveHide] = useState(false);
  useEffect(() => {
    const getMessageUserApi = async () => {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      try {
        const response = await api({
          method: "get",
          url: "/messages/" + id,
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessagesUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }
    };
    getMessageUserApi();
  }, [id, setMessagesUser]);

  const deleteOneComment = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
    try {
      const response = await api({
        method: "get",
        url: "/messages/" + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessagesUser(response.data);
    } catch (error) {
      toastTrigger("error", "une erreur est survenue");
    }
  };

  const deleteOneMessage = (messageId) => {
    const idToRemove = messageId;
    const filteredMessages = messagesUser.filter((item) => item.id !== idToRemove);
    setMessagesUser(filteredMessages);
  };

  const modifyLike = ({ messageId, like, dislike }) => {
    const newMessage = messagesUser.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setMessagesUser(newMessage);
  };

  const modifyComment = ({ messageId, newComments }) => {
    const newMessageComment = messagesUser.filter((element) => {
      if (element.id === messageId) {
        element.comments = newComments;
      }
      return element;
    });
    setMessagesUser(newMessageComment);
  };

  const viewUpdateMessage = (updateMessages) => {
    setMessagesUser(updateMessages);
  };

  const closeMenu = (e) => {
    setActive(false);
    setMessageInModal(null);
    setMessageInModalDestroy(null);
  };

  const openPopUp = () => {
    if (!popUpIsOpen) {
      setPopUpIsOpen(true);
    }
  };
  const openModal = (message) => {
    setMessageInModal(message);
    setActive(true);
  };
  const openModalDestroy = (messageId) => {
    setActiveHide(true);
    setMessageInModalDestroy(messageId);
    setActive(true);
  };
  return (
    <div className="flex-position-message-user">
      {active && messageInModal && (
        <Modal onClick={closeMenu} setActive={setActive} active={active} popUpIsOpen={popUpIsOpen}>
          <MessageUpdate
            id={id}
            setMessagesUser={setMessagesUser}
            setActive={setActive}
            viewUpdateMessage={viewUpdateMessage}
            element={messageInModal}
            setPopUpIsOpen={setPopUpIsOpen}
            openPopUp={openPopUp}
            onClick={closeMenu}
          />
        </Modal>
      )}
      {active && messageInModalDestroy && (
        <Modal
          onClick={closeMenu}
          activeHide={activeHide}
          popUpIsOpen={popUpIsOpen}
          setActive={setActive}
          active={active}
        >
          <MessageDestroy
            onClick={closeMenu}
            openPopUp={openPopUp}
            setPopUpIsOpen={setPopUpIsOpen}
            setActive={setActive}
            deleteOneMessage={deleteOneMessage}
            messageId={messageInModalDestroy}
          />
        </Modal>
      )}
      {messagesUser &&
        messagesUser.map((element) => {
          const lastNameFirstName = element.User.lastName + " " + element.User.firstName;

          const messageLikeByCurrentUser = element?.Likes?.filter((elt) => myUserId === elt.userId);
          return (
            <div key={element.id} className="card-position">
              <div className="f-card">
                <div className="header">
                  <div className="options">
                    {(element.UserId === myUserId || admin === true) && (
                      <Menu
                        id={id}
                        openModalDestroy={openModalDestroy}
                        setMessagesUser={setMessagesUser}
                        openModal={openModal}
                        setActive={setActive}
                        active={active}
                        element={element}
                        viewUpdateMessage={viewUpdateMessage}
                        deleteOneMessage={deleteOneMessage}
                        messageId={element.id}
                      />
                    )}
                  </div>
                  <div className="co-logo-size">
                    <img height="100%" width="100%" className="co-logo" alt="img" src={element.User.avatar} />
                  </div>
                  <div className="co-name">
                    <div>{lastNameFirstName}</div>

                    {isAdmin === true ? <div>Administrateur</div> : <></>}
                  </div>
                  <div className="time">
                    {element.createdAt === element.updatedAt ? (
                      <div>
                        <div>
                          {" "}
                          Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                          <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          {" "}
                          Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                          <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                        </div>
                        <div>
                          {" "}
                          Modifié {moment(new Date(element.updatedAt)).fromNow()}{" "}
                          <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="content">
                  <div className="elt-title">{element.title} </div>
                </div>
                {element.attachment ? (
                  <div className="reference">
                    <div className="reference-thumb">
                      <img alt="img" height="100%" width="100%" src={element.attachment} />
                    </div>
                    <div className="reference-content">
                      <div className="reference-subtitle">{element.content}</div>
                      <div className="reference-font">Groupomania</div>
                    </div>
                  </div>
                ) : (
                  <div className="reference">
                    <div className="reference-content">
                      <div className="reference-subtitle">{element.content}</div>
                      <div className="reference-font">Groupomania</div>
                    </div>
                  </div>
                )}

                <div className="accordions"></div>
                <div className="social">
                  <div className="social-content"></div>
                  <div className="social-buttons">
                    <span>
                      <MessageLike
                        modifyLike={modifyLike}
                        messageId={element.id}
                        like={element.likes}
                        dislike={element.dislikes}
                        messageLikeByCurrentUser={messageLikeByCurrentUser}
                      />
                    </span>
                    <span>
                      <FontAwesomeIcon icon={["far", "comment"]} />
                      {element.comments}
                    </span>
                  </div>
                </div>
              </div>
              <PostComment
                myUserId={myUserId}
                admin={admin}
                deleteOneComment={deleteOneComment}
                modifyComment={modifyComment}
                newComments={element.comments}
                messageId={element.id}
              />
            </div>
          );
        })}
    </div>
  );
};
export default MessageUser;
