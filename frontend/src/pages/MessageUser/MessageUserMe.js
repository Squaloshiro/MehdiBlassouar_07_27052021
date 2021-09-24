import { useState, useEffect } from "react";
import api from "../../config/api";

import Menu from "../../componants/Menu/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageLike from "../../componants/MessageLike/MessageLike";
import "./messageuser.scss";
import moment from "moment";

import { toastTrigger } from "../../helper/toast";
import PostComment from "../../componants/PostComment/PostComment";
import Modal from "../../componants/Modal/Modal";
import MessageUpdate from "../../componants/MessageUpdat/MessageUpdate";
import MessageDestroy from "../../componants/DestroyMsg/DestroyMsg";
const MessageUserMe = ({ avatar, firstName, lastName, myUserId, admin, avatarAdmin }) => {
  const [messagesUser, setMessagesUser] = useState([]);
  const [activeHide, setActiveHide] = useState(false);
  const [active, setActive] = useState(false);
  const [messageInModal, setMessageInModal] = useState(null);
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);
  const [messageInModalDestroy, setMessageInModalDestroy] = useState(null);
  const oldLastNameFirstName = lastName + " " + firstName;
  useEffect(() => {
    const getMessageUserApi = async () => {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      try {
        const response = await api({
          method: "get",
          url: "/messages/" + myUserId,
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessagesUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }
    };
    getMessageUserApi();
  }, [myUserId]);

  const deleteOneComment = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
    try {
      const response = await api({
        method: "get",
        url: "/messages/" + myUserId,
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
    const newMessage2 = messagesUser.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setMessagesUser(newMessage2);
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
    <div className="size-box">
      {active && messageInModal && (
        <Modal onClick={closeMenu} popUpIsOpen={popUpIsOpen} setActive={setActive} active={active}>
          <MessageUpdate
            setMessagesUser={setMessagesUser}
            setActive={setActive}
            messagesUser={messagesUser}
            viewUpdateMessage={viewUpdateMessage}
            element={messageInModal}
            setPopUpIsOpen={setPopUpIsOpen}
            openPopUp={openPopUp}
            onClick={closeMenu}
            myUserId={myUserId}
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
          const messageLikeByCurrentUser = element?.Likes?.filter((elt) => myUserId === elt.userId);
          const lastNameFirstName = element.User.lastName + " " + element.User.firstName;

          return (
            <div key={element.id} className="card-position">
              <div className="f-card">
                <div className="header">
                  <div className="options">
                    {(element.UserId === myUserId || admin === true) && (
                      <Menu
                        openModalDestroy={openModalDestroy}
                        setMessagesUser={setMessagesUser}
                        openModal={openModal}
                        setActive={setActive}
                        active={active}
                        element={element}
                        messagesUser={messagesUser}
                        viewUpdateMessage={viewUpdateMessage}
                        deleteOneMessage={deleteOneMessage}
                        messageId={element.id}
                        myUserId={myUserId}
                      />
                    )}
                  </div>
                  <div className="co-logo-size">
                    <img height="100%" width="100%" className="co-logo" alt="" src={avatar} />
                  </div>
                  <div className="co-name">
                    {oldLastNameFirstName ? <div>{oldLastNameFirstName}</div> : <div>{lastNameFirstName}</div>}

                    {element.User.isAdmin === true ? <div>Administrateur</div> : <></>}
                  </div>
                  <div className="time">
                    {element.createdAt === element.updatedAt ? (
                      <div>
                        <div className="post-color">
                          {" "}
                          Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                          <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="post-color">
                          {" "}
                          Postée {moment(new Date(element.createdAt)).fromNow()}{" "}
                          <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                        </div>
                        <div className="post-color">
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
                    <img height="100%" width="100%" alt="" className="reference-thumb" src={element.attachment} />
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
                    <span className="post-color">
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
export default MessageUserMe;
