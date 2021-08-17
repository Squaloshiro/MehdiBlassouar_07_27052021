import api from "../../config/api";
import { useHistory } from "react-router-dom";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";

const MessageDestroy = ({ messageId, deleteOneMessage }) => {
  const history = useHistory();

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
      history.push("/");
      toastTrigger("success", "Publication supprimée");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return <Button onClick={destroyMessage} title="Supprimer" />;
};
export default MessageDestroy;
