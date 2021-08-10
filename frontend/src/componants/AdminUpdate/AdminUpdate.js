import Button from "../Button/Button";
import api from "../../config/api";
import { useState } from "react";
const AdminUpdate = ({ idUser }) => {
  const [active, setActive] = useState("");
  const AdminClick = () => {
    const update = async () => {
      try {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
        const response = await api({
          method: "put",
          url: "/users/" + idUser,
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        setActive(response.data);
      } catch (error) {}
    };
    update();
  };

  return (
    <div>
      {!active ? (
        <Button onClick={AdminClick} title="Donnée les droits" />
      ) : (
        <Button onClick={AdminClick} title="Enlevée les droits" />
      )}
    </div>
  );
};

export default AdminUpdate;
