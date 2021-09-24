import api from "../../config/api";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MessageLike = ({ modifyLike, messageId, like, dislike, messageLikeByCurrentUser }) => {
  const [isLike, setIsLike] = useState(["far", "thumbs-up"]);
  const [isDislike, setIsDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (messageLikeByCurrentUser?.length) {
      if (messageLikeByCurrentUser[0].userLike) {
        setIsLike(["fas", "thumbs-up"]);
      } else if (messageLikeByCurrentUser[0].userDislike) {
        setIsDislike(["fas", "thumbs-down"]);
      }
    }
  }, [messageLikeByCurrentUser]);

  const onSubmitLikeMessage = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "post",
        url: "/messages/" + messageId + "/vote/like",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });

      let userLike;
      let userDislike;
      if (response.data === "like ajoutée") {
        userLike = true;
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
      } else if (response.data === "like ajoutée, dislike retirée") {
        userLike = true;
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
        userDislike = false;
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      } else if (response.data === "like retirée") {
        userLike = false;
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      }

      modifyLike({ messageId, like, dislike, userLike, userDislike });

      //history.push("/");
    } catch (error) {
      console.log("---------------123---------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  const onSubmitDislikeMessage = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "post",
        url: "/messages/" + messageId + "/vote/dislike",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      let userLike;
      let userDislike;
      if (response.data === "dislike ajoutée") {
        userDislike = true;
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
      } else if (response.data === "dislike ajoutée, like retirée") {
        userDislike = true;
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
        userLike = false;
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      } else if (response.data === "dislike retirée") {
        userDislike = false;
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      }
      modifyLike({ messageId, dislike, like, userLike, userDislike });

      //history.push("/");
    } catch (error) {
      console.log("---------------123---------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div>
      <span className="like-color">
        <FontAwesomeIcon title="Like" aria-hidden="true" color="blue" icon={isLike} onClick={onSubmitLikeMessage} />
        {like}
      </span>
      <span className="dislike-color">
        <FontAwesomeIcon
          title="Dislike"
          aria-hidden="true"
          color="rgb(172, 23, 23)"
          icon={isDislike}
          onClick={onSubmitDislikeMessage}
        />
        {dislike}
      </span>
    </div>
  );
};
export default MessageLike;
