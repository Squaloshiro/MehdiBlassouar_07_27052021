import api from "../../config/api";
import { useHistory } from "react-router-dom";

import Button from "../Button/Button";

const DropAccount = ({ setIsLoggedin, userId, admin }) => {
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
      } else {
        setIsLoggedin(false);
        sessionStorage.removeItem("groupomaniaToken");
        history.push("/connexion");
      }
    } catch (error) {}
  };

  return (
    <div>
      <Button onClick={dropProfil} title="Supprimer" />
    </div>
  );
};

export default DropAccount;
