import api from "../../config/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

const CommentLike = ({ modifyCommentLike, commentsId, like, dislike, messageCommentLikeByCurrentUser }) => {
  const [isLike, setIsLike] = useState(["far", "thumbs-up"]);
  const [isDislike, setIsDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (messageCommentLikeByCurrentUser?.length) {
      if (messageCommentLikeByCurrentUser[0].userLike) {
        setIsLike(["fas", "thumbs-up"]);
      } else if (messageCommentLikeByCurrentUser[0].userDislike) {
        setIsDislike(["fas", "thumbs-down"]);
      }
    }
  }, [messageCommentLikeByCurrentUser]);

  const onSubmitLikeComment = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "post",
        url: "/comment/" + commentsId + "/vote/like",
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
      } else if (response.data === "dislike retirée, like ajouté") {
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
      modifyCommentLike({ commentsId, like, dislike, userLike, userDislike });

      //history.push("/")
    } catch (error) {
      console.log("---------------123---------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  const onSubmitDislikeComment = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "post",
        url: "/comment/" + commentsId + "/vote/dislike",
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
      } else if (response.data === "like retiré ,dislike ajouté") {
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
      modifyCommentLike({ commentsId, dislike, like, userLike, userDislike });

      //history.push("/")
    } catch (error) {
      console.log("---------------123---------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div>
      <span>
        <FontAwesomeIcon color="blue" icon={isLike} onClick={onSubmitLikeComment} />
        {like}
      </span>
      <span>
        <FontAwesomeIcon color="red" icon={isDislike} onClick={onSubmitDislikeComment} />
        {dislike}
      </span>
    </div>
  );
};
export default CommentLike;
