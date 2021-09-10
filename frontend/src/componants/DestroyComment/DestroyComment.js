import api from "../../config/api";
import "./destroyComment.scss";
import { toastTrigger } from "../../helper/toast";
import Button from "../Button/Button";

const DestroyComment = ({
  messageId,
  close,
  setPopUpIsOpen,
  setActive,
  newComments,
  modifyComment,
  deleteOneComment,
  commentsId,
}) => {
  const handleClose = () => {
    setPopUpIsOpen(false);
    close();
  };

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
      setActive(false);
      close();
      toastTrigger("success", "Commantaire supprimé");
    } catch (error) {
      toastTrigger("error", "une erreur est survenue");
    }
  };

  return (
    <div className="destroy-comment-flex">
      <div>Voullez-vous supprimer votre message</div>
      <div>
        <Button onClick={commentDestroy} title="Supprimer" />
        <Button onClick={handleClose} title="Annuler" />
      </div>
    </div>
  );
};
export default DestroyComment;
