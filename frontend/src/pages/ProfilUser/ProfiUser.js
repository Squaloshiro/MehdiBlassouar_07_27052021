import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory, useLocation } from "react-router";
import DropAccount from "../../componants/DropAccount/DropAccount";
import MessageUser from "../MessageUser/MessageUser";
import "./profiluser.scss";
import AdminUpdate from "../../componants/AdminUpdate/AdminUpdate";
import { toastTrigger } from "../../helper/toast";
const ProfilUser = ({ myUserId, admin, setIsLoggedin, setCheckLogin }) => {
  const location = useLocation();
  const history = useHistory();
  const [profil, setProfil] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(profil?.isAdmin);
  }, [profil?.isAdmin]);

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
          toastTrigger("error", "une erreur est survenu");
        }
      };
      getProfilUser();
    } else {
      history.push("/");
    }
  }, [history, location.state.id]);

  return (
    <div className="flex-direction-2">
      <div className="size-2">
        <div className="size-profil-2">
          <div className="bor-username-2">
            <div>{profil.username}</div>
          </div>
          <div className="flex-elt-profil-2">
            <div className="flex-picturs-2">
              <div className="size-police-photo-2">Photo de profil</div>
              <img alt="img" className="size-picturs-2" src={profil.avatar} />
            </div>
            <div className="size-elt-2">
              <div className="email-2">
                <div className="size-police-2">E-mail</div>
                <div>{profil.email}</div>
              </div>
              <div>
                <div className="size-police-2">Description</div>
                {profil.bio ? (
                  <div className="margin-bio-2">{profil.bio}</div>
                ) : (
                  <div className="margin-bio-2"> Description est vide</div>
                )}
                {admin === true ? (
                  <div>
                    <AdminUpdate isAdmin={isAdmin} setIsAdmin={setIsAdmin} profil={profil} idUser={location.state.id} />
                    <DropAccount
                      admin={admin}
                      setCheckLogin={setCheckLogin}
                      setIsLoggedin={setIsLoggedin}
                      userId={location.state.id}
                      title="Suprimer le compte"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-msg-2">
        <MessageUser isAdmin={isAdmin} admin={admin} myUserId={myUserId} id={location.state.id} />
      </div>
    </div>
  );
};
export default ProfilUser;
