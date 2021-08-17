import { useState, useEffect } from "react";
import api from "../../config/api";
import Menu from "../../componants/Menu/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageLike from "../../componants/MessageLike/MessageLike";
import Accordion from "../../componants/AccordionComment/Accordion";
import PostComment from "../../componants/PostComment/PostComment";
import Modal from "../../componants/Modal/Modal";
const MessageUser = ({ id, myUserId, admin }) => {
  const [messagesUser, setMessagesUser] = useState([]);
  const [comments, setcomments] = useState([]);
  const [active, setActive] = useState(false);
  const [messageInModal, setMessageInModal] = useState(null);
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);

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
        console.log("------------------------------------");
        console.log(error);
        console.log("------------------------------------");
      }
    };
    getMessageUserApi();
  }, [id]);

  const deleteOneComment = async (test) => {
    //const idToRemove = commentId
    /* const filteredMessages = messagesUser.map((element) => {
      const test = element.Comments;
      // test.filter((item) => item.id !== idToRemove);
      test.splice(0, 1);
    });*/
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
    try {
      const response = await api({
        method: "get",
        url: "/messages/" + id,
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessagesUser(response.data);
    } catch (error) {
      //rajouter un button en cas d'echec de chargement des messages
      console.log("-------------error-----------------------");
      console.log(error);
      console.log("------------------------------------");
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

  const postComment = (newComments) => {
    setcomments(newComments);
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
    <div>
      {active && messageInModal && (
        <Modal
          setActive={setActive}
          active={active}
          openPopUp={openPopUp}
          setPopUpIsOpen={setPopUpIsOpen}
          onClick={closeMenu}
          viewUpdateMessage={viewUpdateMessage}
          element={messageInModal}
          messageId={messageInModal.id}
        />
      )}
      {messagesUser &&
        messagesUser.map((element) => {
          const messageLikeByCurrentUser = element?.Likes?.filter((elt) => myUserId === elt.userId);
          return (
            <div key={element.id} className="card-position">
              <div className="f-card">
                <div className="header">
                  <div className="options">
                    {element.UserId === myUserId || admin === true ? (
                      <Menu
                        openModal={openModal}
                        setActive={setActive}
                        active={active}
                        element={element}
                        viewUpdateMessage={viewUpdateMessage}
                        deleteOneMessage={deleteOneMessage}
                        messageId={element.id}
                      />
                    ) : (
                      <> </>
                    )}
                  </div>
                  <img className="co-logo" alt="img" src={element.User.avatar} />
                  <div className="co-name">
                    <div>{element.User.username}</div>
                  </div>
                  <div className="time">
                    <div>{element.createdAt}</div> · <FontAwesomeIcon icon={["fas", "globe"]} />{" "}
                  </div>
                </div>
                <div className="content">
                  <div>{element.title} </div>
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

                <div className="accordions">
                  <Accordion
                    comments={comments}
                    setcomments={setcomments}
                    myUserId={myUserId}
                    modifyComment={modifyComment}
                    newComments={element.comments}
                    deleteOneComment={deleteOneComment}
                    messageId={element.id}
                    admin={admin}
                    title="commentaire"
                  />
                </div>
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
                modifyComment={modifyComment}
                newComments={element.comments}
                postComment={postComment}
                messageId={element.id}
              />
            </div>
          );
        })}
    </div>
  );
};
export default MessageUser;
