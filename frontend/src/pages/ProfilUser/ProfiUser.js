import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageUser from "../MessageUser/MessageUser";

const ProfilUser = () => {
  const location = useLocation();
  const history = useHistory();
  const [profil, setProfil] = useState({});

  useEffect(() => {
    if (location?.state?.id) {
      const getProfilUser = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
        try {
          const response = await api({
            method: "get",
            url: "/users/" + location.state.id,
            headers: { Authorization: `Bearer ${token}` },
          });

          setProfil(response.data);
        } catch (error) {
          console.log("-------------error-----------------------");
          console.log(error);
          console.log("------------------------------------");
        }
      };
      getProfilUser();
    } else {
      history.push("/");
    }
  }, []);

  return (
    <div>
      <div>
        <div>
          <div>{profil.username}</div>
          <div>{profil.bio}</div>
        </div>
        <div>
          <MessageUser id={location.state.id} />
        </div>
      </div>
    </div>
  );
};
export default ProfilUser;
