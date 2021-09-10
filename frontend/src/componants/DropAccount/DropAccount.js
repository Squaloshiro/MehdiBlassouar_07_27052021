import api from "../../config/api";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";
import "./dropaccount.scss";

const DropAccount = ({ userId, isLoggedin, admin, setIsLoggedin, setDataUser }) => {
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
        try {
          const response = await api({
            method: "get",
            url: "/users/all",
            headers: { Authorization: `Bearer ${token}` },
          });
          setDataUser(response.data);
        } catch (error) {
          toastTrigger("error", "une erreur est survenue");
        }
        history.push("/");
        toastTrigger("success", "Compte supprimé");
      } else {
        sessionStorage.removeItem("groupomaniaToken");
        history.push("/connexion");
        setIsLoggedin(false);
        toastTrigger("success", "Compte supprimé");
      }
    } catch (error) {
      if (error.response.data.error === "Donner les droits d'accès") {
        setActive(false);
        toastTrigger("error", error.response.data.error);
      } else {
        setActive(false);
        toastTrigger("error", "une erreur est survenue");
      }
    }
  };

  return (
    <div className="position-button-drop">
      {!active ? (
        <div className="position-button-drop-account">
          <Button onClick={handleActive} title="Supprimer" />
        </div>
      ) : (
        <div className="select-choise-drop-account">
          <div className="style-size-drop">Voulez-vous supprimé votre compte, cette action est définitive.</div>
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
