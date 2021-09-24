import Button from "../Button/Button";
import api from "../../config/api";
import { toastTrigger } from "../../helper/toast";
import "./adminupdate.scss";
import { useHistory, useParams } from "react-router";
const AdminUpdate = ({
  idUser,
  setDataUser,
  setMessagesUser,
  setProfil,
  setMessages,

  isAdmin,
  setIsAdmin,
  setAvatar,
}) => {
  const params = useParams();
  const history = useHistory();
  const AdminClick = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/" + idUser,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setAvatar(response.data.avatar);
      setIsAdmin(response.data.isAdmin);
      try {
        const response = await api({
          method: "get",
          url: "/messages",
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        //rajouter un button en cas d'echec de chargement des messages
      }
      if (params?.id) {
        try {
          const response = await api({
            method: "get",
            url: "/users/" + params.id,
            headers: { Authorization: `Bearer ${token}` },
          });

          setProfil(response.data);
        } catch (error) {
          toastTrigger("error", "une erreur est survenue");
        }
      } else {
        history.push("/");
      }
      try {
        const response = await api({
          method: "get",
          url: "/messages/" + idUser,
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessagesUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }
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
      if (response.data.isAdmin === true) {
        toastTrigger("success", "Admin créée");
      } else {
        toastTrigger("success", "Admin sup");
      }
    } catch (error) {
      toastTrigger("error", "une erreur est survenue");
    }
  };

  return (
    <div className="button-position-session">
      <Button onClick={AdminClick} title={!isAdmin ? "Donner les droits" : "Enlever les droits"} />
    </div>
  );
};

export default AdminUpdate;
