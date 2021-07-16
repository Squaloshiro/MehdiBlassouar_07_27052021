import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";

const PostComment = ({ postComment, messageId, updatViewMessage, newComments, modifyComment }) => {
  const history = useHistory();

  const [content, setContent] = useState("");

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onSubmitComment = async (e) => {
    e.preventDefault();
    const obj = { content };

    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "post",
        url: messageId + "/comment/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      newComments = newComments + 1;

      modifyComment({ newComments, messageId });
      postComment(response.data);

      // history.push("/");
    } catch (error) {
      console.log("------------------------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div className="post-cadre">
      <Input onChange={onChangeContent} label="Comment" value={content} type="text" />
      <Button size="small" onClick={onSubmitComment} title="Envoyer" />
    </div>
  );
};
export default PostComment;
