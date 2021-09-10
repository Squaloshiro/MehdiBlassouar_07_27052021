import Button from "../../componants/Button/Button";
import { useState, useEffect } from "react";
import api from "../../config/api";
import { toastTrigger } from "../../helper/toast";
import Accordion from "../AccordionComment/Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextArea from "../TextArea/InputTextArea";
import "./postcomment.scss";

const PostComment = ({ myUserId, admin, messageId, deleteOneComment, newComments, modifyComment }) => {
  const [content, setContent] = useState("");
  const [comments, setcomments] = useState([]);
  const [compteurContent, setCompteurContent] = useState(0);
  const [maxContent, setmaxContent] = useState("");
  const [classNameContent, setClassNameContent] = useState("color-green");
  const send = <FontAwesomeIcon icon={["fas", "paper-plane"]} />;

  useEffect(() => {
    if (compteurContent > 1000) {
      setClassNameContent("color_red");
      setmaxContent("atteind");
    } else {
      setClassNameContent("color-green");
      setmaxContent("");
    }
  }, [compteurContent]);

  const onChangeContent = (e) => {
    setCompteurContent(e.target.value.length);
    setContent(e.target.value);
  };
  const postComment = (newComments) => {
    setcomments(newComments);
  };
  const onSubmitComment = async (e) => {
    e.preventDefault();
    const obj = { content };

    if (!content) {
      toastTrigger("error", "une erreur est survenue");
      return;
    }
    if (compteurContent > 1000) {
      toastTrigger("error", "une erreur est survenue");
    } else {
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
        setCompteurContent(0);
        toastTrigger("success", "Commantaire posté");
        try {
          const response = await api({
            method: "get",
            url: "/comment/" + messageId,
            headers: { Authorization: `Bearer ${token}` },
          });

          postComment(response.data);
        } catch (error) {
          toastTrigger("error", "une erreur est survenue");
        }
        // history.push("/");
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }
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
        title="Afficher les commentaires"
      />
      <div className="post-cadre-comment">
        <div className="post-cadre-comment-input">
          <TextArea
            style={{ width: "97.3%" }}
            label="Comment"
            rows={2}
            variant="outlined"
            onChange={onChangeContent}
            placeholder="Text"
            value={content}
          />
          {compteurContent > 0 && (
            <div className={classNameContent}>
              Limite de caractère {maxContent} : {compteurContent}/1000
            </div>
          )}
          <Button size="small" onClick={onSubmitComment} title={send} />
        </div>
      </div>
    </div>
  );
};
export default PostComment;
