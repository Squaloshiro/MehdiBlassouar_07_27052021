import api from "../../config/api";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";

const DropAccount = ({ setIsLoggedin, userId, admin }) => {
  const history = useHistory();
  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(true);
  };
  const handleClose = () => {
    setActive(false);
  };
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
        toastTrigger("success", "Compte supprimé");
      }
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div>
      {!active ? (
        <Button onClick={handleActive} title="Supprimer" />
      ) : (
        <div>
          <div>Voulez-vous supprimé votre compte, cette action est définitive.</div>
          <div>
            <Button onClick={dropProfil} title="Oui" />
            <Button onClick={handleClose} title="Non" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropAccount;
