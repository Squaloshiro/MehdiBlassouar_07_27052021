import Button from "../Button/Button";
import api from "../../config/api";
import { toastTrigger } from "../../helper/toast";
const AdminUpdate = ({ idUser, profil, isAdmin, setIsAdmin }) => {
  const AdminClick = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/" + idUser,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setIsAdmin(response.data);
      if (response.data === true) {
        toastTrigger("success", "Admin créée");
      } else {
        toastTrigger("success", "Admin sup");
      }
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div>
      <Button onClick={AdminClick} title={!isAdmin ? "Donner les droits" : "Enlever les droits"} />
    </div>
  );
};

export default AdminUpdate;
