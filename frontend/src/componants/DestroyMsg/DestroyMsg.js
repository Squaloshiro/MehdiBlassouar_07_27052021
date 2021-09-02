import api from "../../config/api";
import "./destroyMsg.scss";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";

const MessageDestroy = ({ messageId, setActive, deleteOneMessage, onClick, setPopUpIsOpen }) => {
  const handleClose = () => {
    setPopUpIsOpen(false);

    onClick();
  };

  const destroyMessage = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      await api({
        method: "delete",
        url: "/messages/" + messageId,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      deleteOneMessage(messageId);
      onClick();
      toastTrigger("success", "Publication supprimée");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div className="destroy-msg-flex">
      <div>Voullez-vous supprimer votre message</div>
      <div>
        <Button onClick={destroyMessage} title="Supprimer" />
        <Button onClick={handleClose} title="Annuler" />
      </div>
    </div>
  );
};
export default MessageDestroy;
