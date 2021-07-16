import api from "../../config/api";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MessageLike = ({ modifyLike, messageId, like, dislike }) => {
  const history = useHistory();
  const [isLike, setIsLike] = useState(["far", "thumbs-up"]);
  const [isDislike, setIsDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (like === 1) {
      setIsLike(["fas", "thumbs-up"]);
    }
    if (dislike === 1) {
      setIsDislike(["fas", "thumbs-down"]);
    }
  }, []);
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
      if (response.data === "like ajoutée") {
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
      } else if (response.data === "like ajoutée, dislike retirée") {
        like = like + 1;
        setIsLike(["fas", "thumbs-up"]);
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      } else if (response.data === "like retirée") {
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      }
      modifyLike({ messageId, like, dislike });

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

      if (response.data === "dislike ajoutée") {
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
      } else if (response.data === "dislike ajoutée, like retirée") {
        dislike = dislike + 1;
        setIsDislike(["fas", "thumbs-down"]);
        like = like - 1;
        setIsLike(["far", "thumbs-up"]);
      } else if (response.data === "dislike retirée") {
        dislike = dislike - 1;
        setIsDislike(["far", "thumbs-down"]);
      }
      modifyLike({ messageId, dislike, like });

      //history.push("/");
    } catch (error) {
      console.log("---------------123---------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div>
      <span>
        <FontAwesomeIcon color="blue" icon={isLike} onClick={onSubmitLikeMessage} />
        {like}
      </span>
      <span>
        <FontAwesomeIcon color="red" icon={isDislike} onClick={onSubmitDislikeMessage} />
        {dislike}
      </span>
    </div>
  );
};
export default MessageLike;
