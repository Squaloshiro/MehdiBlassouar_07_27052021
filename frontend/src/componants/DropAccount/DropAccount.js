import api from "../../config/api";
import { useHistory } from "react-router-dom";

import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";

const DropAccount = ({ setIsLoggedin, userId, admin, setCheckLogin }) => {
  const history = useHistory();

  const dropProfil = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      await api({
        method: "delete",
        url: "/users/" + userId,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      if (admin) {
        history.push("/");
        toastTrigger("success", "Compte supprimé");
      } else {
        sessionStorage.removeItem("groupomaniaToken");
        history.push("/connexion");
        setIsLoggedin(false);
        setCheckLogin(false);
        toastTrigger("success", "Compte supprimé");
      }
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div>
      <Button onClick={dropProfil} title="Supprimer" />
    </div>
  );
};

export default DropAccount;
