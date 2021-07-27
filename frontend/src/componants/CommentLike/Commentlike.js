import api from "../../config/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

const CommentLike = ({ modifyCommentLike, commentsId, like, dislike }) => {
  const [isLike, setIsLike] = useState(["far", "thumbs-up"]);
  const [isDislike, setIsDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (like === 1) {
      setIsLike(["fas", "thumbs-up"]);
    }
    if (dislike === 1) {
      setIsDislike(["fas", "thumbs-down"]);
    }
  }, [like, dislike]);

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
      if (response.data === "like ajoutée") {
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
      } else if (response.data === "dislike retirée, like ajouté") {
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      } else if (response.data === "like retirée") {
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      }
      modifyCommentLike({ commentsId, like, dislike });

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

      if (response.data === "dislike ajoutée") {
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
      } else if (response.data === "like retiré ,dislike ajouté") {
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      } else if (response.data === "dislike retirée") {
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      }
      modifyCommentLike({ commentsId, dislike, like });

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
