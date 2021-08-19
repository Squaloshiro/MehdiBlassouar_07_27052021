import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState } from "react";
import api from "../../config/api";
import { toastTrigger } from "../../helper/toast";
import Accordion from "../AccordionComment/Accordion";
const PostComment = ({ myUserId, admin, messageId, deleteOneComment, newComments, modifyComment }) => {
  const [content, setContent] = useState("");
  const [comments, setcomments] = useState([]);
  const onChangeContent = (e) => {
    setContent(e.target.value);
  };
  const postComment = (newComments) => {
    setcomments(newComments);
  };
  const onSubmitComment = async (e) => {
    e.preventDefault();
    const obj = { content };

    if (!content) {
      toastTrigger("error", "une erreur est survenu");
      return;
    }

    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      await api({
        method: "post",
        url: messageId + "/comment/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      newComments = newComments + 1;
      modifyComment({ newComments, messageId });
      setContent("");
      toastTrigger("success", "Commantaire posté");
      try {
        const response = await api({
          method: "get",
          url: "/comment/" + messageId,
          headers: { Authorization: `Bearer ${token}` },
        });

        postComment(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenu");
      }
      // history.push("/");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div>
      <Accordion
        comments={comments}
        setcomments={setcomments}
        myUserId={myUserId}
        modifyComment={modifyComment}
        newComments={newComments}
        deleteOneComment={deleteOneComment}
        messageId={messageId}
        admin={admin}
        title="commentaire"
      />
      <div className="post-cadre">
        <Input onChange={onChangeContent} label="Comment" value={content} type="text" />
        <Button size="small" onClick={onSubmitComment} title="Envoyer" />
      </div>
    </div>
  );
};
export default PostComment;
