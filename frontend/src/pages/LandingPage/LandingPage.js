import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import "./landingpage.scss";
import Menu from "../../componants/Menu/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageLike from "../../componants/MessageLike/MessageLike";
import MessageImage from "../PostMessage/PostMessage";

import PostComment from "../../componants/PostComment/PostComment";
import Modal from "../../componants/Modal/Modal";
import MessageUpdate from "../../componants/MessageUpdat/MessageUpdate";
const LandingPage = ({ myUserId, admin }) => {
  const history = useHistory();
  const [messages, setMessages] = useState([]);

  const [active, setActive] = useState(false);
  const [messageInModal, setMessageInModal] = useState(null);
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("groupomaniaToken")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      const getMessageApi = async () => {
        try {
          const response = await api({
            method: "get",
            url: "/messages",
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data);
        } catch (error) {
          //rajouter un button en cas d'echec de chargement des messages
        }
      };

      getMessageApi();
    } else {
      history.push("/connexion");
    }
  }, [history]);

  const deleteOneComment = async (test) => {
    //const idToRemove = commentId
    /*const filteredMessages = messages.map((element) => {
      const test = element.Comments;
      // test.filter((item) => item.id !== idToRemove);
      test.splice(0, 1);
    });*/
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
    try {
      const response = await api({
        method: "get",
        url: "/messages",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      //rajouter un button en cas d'echec de chargement des messages
    }
  };

  const deleteOneMessage = (messageId) => {
    const idToRemove = messageId;
    const filteredMessages = messages.filter((item) => item.id !== idToRemove);
    setMessages(filteredMessages);
  };

  const redirectToUserProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/users/profils", state: { id } });
    }
  };

  const modifyLike = ({ messageId, like, dislike, userLike, userDislike }) => {
    const newMessage = messages.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
        const messageLikeByCurrentUser = element?.Likes?.filter((elt) => myUserId === elt.userId);
        if (messageLikeByCurrentUser?.length) {
          messageLikeByCurrentUser[0].userLike = userLike;
          messageLikeByCurrentUser[0].userDislike = userDislike;
        }
      }
      return element;
    });

    setMessages(newMessage);
  };

  const modifyComment = ({ messageId, newComments }) => {
    const newMessageComment = messages.filter((element) => {
      if (element.id === messageId) {
        element.comments = newComments;
      }
      return element;
    });
    setMessages(newMessageComment);
  };

  const postMessage = (newMessages) => {
    setMessages(newMessages);
  };

  const viewUpdateMessage = (updateMessages) => {
    setMessages(updateMessages);
  };

  const closeMenu = (e) => {
    setActive(false);
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

  return (
    <div className="flex-position">
      <MessageImage postMessage={postMessage} />
      {active && messageInModal && (
        <Modal popUpIsOpen={popUpIsOpen} setActive={setActive} active={active}>
          <MessageUpdate
            setActive={setActive}
            viewUpdateMessage={viewUpdateMessage}
            element={messageInModal}
            setPopUpIsOpen={setPopUpIsOpen}
            openPopUp={openPopUp}
            onClick={closeMenu}
          />
        </Modal>
      )}

      {messages &&
        messages.map((element) => {
          const messageLikeByCurrentUser = element?.Likes?.filter((elt) => myUserId === elt.userId);

          return (
            <div key={element.id} className="card-position">
              <div className="f-card">
                <div className="header">
                  <div className="options">
                    {(element.UserId === myUserId || admin === true) && (
                      <Menu
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
                  <img className="co-logo" alt="img" src={element.User.avatar} />
                  <div className="co-name">
                    <div onClick={() => redirectToUserProfil(element.UserId)}>{element.User.username}</div>
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
                  <div className="elt-title">{element.title} </div>
                </div>
                {element.attachment ? (
                  <div className="reference">
                    <img alt="img" className="reference-thumb" src={element.attachment} />
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
export default LandingPage;
