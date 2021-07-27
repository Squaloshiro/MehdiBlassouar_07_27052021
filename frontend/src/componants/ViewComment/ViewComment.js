import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import DestroyComment from "../DestroyComment/DestroyComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostComment from "../PostComment/PostComment";
import CommentLike from "../CommentLike/Commentlike";

const ViewComment = ({ messageId, updatViewMessage }) => {
  const history = useHistory();
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("groupomaniaToken")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

      const getCommentApi = async () => {
        try {
          const response = await api({
            method: "get",
            url: "/comment/" + messageId,
            headers: { Authorization: `Bearer ${token}` },
          });
          setcomments(response.data);
        } catch (error) {
          history.push("/connexion");
        }
      };

      getCommentApi();
    } else {
      history.push("/connexion");
    }
  }, [history]);

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

  const postComment = (newComments) => {
    setcomments(newComments);
  };

  const redirectToUserProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/users/profils", state: { id } });
    }
  };

  return (
    <div className="flex-position">
      {comments &&
        comments.map((element) => {
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
                        modifyCommentLike={modifyCommentLike}
                        commentsId={element.id}
                        like={element.likes}
                        dislike={element.dislikes}
                      />
                    </span>
                    <span>
                      <DestroyComment
                        commentsId={element.id}
                        messageId={messageId}
                        deleteOneComment={deleteOneComment}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <PostComment updatViewMessage={updatViewMessage} postComment={postComment} messageId={messageId} />
    </div>
  );
};
export default ViewComment;
