import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory, useParams } from "react-router";
import DropAccount from "../../componants/DropAccount/DropAccount";
import MessageUser from "../MessageUser/MessageUser";
import "./profiluser.scss";
import AdminUpdate from "../../componants/AdminUpdate/AdminUpdate";
import { toastTrigger } from "../../helper/toast";
const ProfilUser = ({
  profil,
  setProfil,
  setMessages,
  myUserId,
  admin,
  isLoggedin,
  setIsLoggedin,
  setCheckLogin,
  setDataUser,
  setAvatar,
  avatar,
}) => {
  const params = useParams();
  const history = useHistory();
  const [isAdmin, setIsAdmin] = useState(false);
  const [messagesUser, setMessagesUser] = useState([]);
  useEffect(() => {
    if (parseInt(params?.id) === myUserId) {
      history.push("/profil");
      return;
    }
  }, [history, params.id, myUserId]);
  useEffect(() => {
    if (params?.id) {
      const getProfilUser = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
        try {
          const response = await api({
            method: "get",
            url: "/users/" + params.id,
            headers: { Authorization: `Bearer ${token}` },
          });

          setProfil(response.data);
          setIsAdmin(profil?.isAdmin);
        } catch (error) {
          toastTrigger("error", "une erreur est survenue");
          history.push("/");
        }
      };
      getProfilUser();
    } else {
      history.push("/");
    }
  }, [history, params.id, setProfil, profil?.isAdmin, myUserId]);

  return (
    <div className="flex-direction-2">
      <div className="size-2">
        <div className="size-profil-2">
          <div className="flex-name-pictur">
            <div className="flex-picturs-2">
              <div className="size-police-photo-2">Avatar</div>
              <img alt="img" className="size-picturs-2" src={profil.avatar} />
            </div>
            <div className="bor-username-2">
              <div>{profil.firstName}</div>
              <div>{profil.lastName}</div>
            </div>
          </div>

          <div className="flex-elt-profil-2">
            <div className="size-elt-2">
              <div className="email-2">
                <div className="size-police-2">E-mail</div>
                <div className="email-breack">{profil.email}</div>
              </div>
              <div>
                <div className="size-police-2">Description</div>
                {profil.bio ? (
                  <div className="margin-bio-2">{profil.bio}</div>
                ) : (
                  <div className="margin-bio-2"> Description est vide</div>
                )}
                {admin === true ? (
                  <div className="admin-control">
                    <div className="admin-control-session">
                      <AdminUpdate
                        setProfil={setProfil}
                        setMessages={setMessages}
                        setAvatar={setAvatar}
                        isAdmin={isAdmin}
                        setIsAdmin={setIsAdmin}
                        profil={profil}
                        idUser={params.id}
                        messagesUser={messagesUser}
                        setMessagesUser={setMessagesUser}
                        setDataUser={setDataUser}
                      />
                    </div>
                    <div className="admin-control-drop">
                      <DropAccount
                        isLoggedin={isLoggedin}
                        setIsLoggedin={setIsLoggedin}
                        setDataUser={setDataUser}
                        admin={admin}
                        setCheckLogin={setCheckLogin}
                        userId={params.id}
                        title="Suprimer le compte"
                      />
                    </div>
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
        <MessageUser
          messagesUser={messagesUser}
          setMessagesUser={setMessagesUser}
          avatar={avatar}
          isAdmin={isAdmin}
          admin={admin}
          myUserId={myUserId}
          id={params.id}
        />
      </div>
    </div>
  );
};
export default ProfilUser;
