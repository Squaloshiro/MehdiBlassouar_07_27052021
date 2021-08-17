import api from "../../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toastTrigger } from "../../helper/toast";

const DestroyComment = ({ messageId, newComments, modifyComment, deleteOneComment, commentsId }) => {
  const commentDestroy = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      await api({
        method: "delete",
        url: "/comment/" + messageId + "/" + commentsId,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });

      deleteOneComment(commentsId);
      newComments = newComments - 1;
      modifyComment({ newComments, messageId });
      // history.push("/");
      toastTrigger("success", "Commantaire supprimé");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return <FontAwesomeIcon color="red" icon={["fas", "trash-alt"]} onClick={commentDestroy} />;
};
export default DestroyComment;
