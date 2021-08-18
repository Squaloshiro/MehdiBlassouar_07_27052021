import { useState, useEffect } from "react";
import api from "../../config/api";

import MessageUserMe from "../MessageUser/MessageUserMe";
import "./profilPage.scss";
import Avatar from "../Avatars/Avatars";
import UpdadePassword from "../../componants/UpdatPassword/UpdatePassword";
import DropAccount from "../../componants/DropAccount/DropAccount";
import Modal from "../../componants/Modal/Modal";

const ProfilPage = ({ setIsLoggedin, admin, myUserId }) => {
  const [profil, setProfil] = useState({});
  const [bio, setBio] = useState("");
  const [active, setActive] = useState(false);

  const onChangeAvatar = (newAvatar) => {
    setProfil(newAvatar);
  };

  const onChangeBio = (e) => {
    setBio(e.target.value);
  };

  const openModal = () => {
    setActive(true);
  };
  const closeModal = () => {
    setActive(false);
  };

  useEffect(() => {
    const getProfilUser = async () => {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      try {
        const response = await api({
          method: "get",
          url: "/users/me",
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfil(response.data);
        try {
        } catch (error) {}
      } catch (error) {
        console.log("-------------error-----------------------");
        console.log(error);
        console.log("------------------------------------");
      }
    };
    getProfilUser();
  }, []);

  const updateProfilBio = async () => {
    const obj = { bio };
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/me/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setProfil(response.data);
    } catch (error) {}
  };

  return profil?.id ? (
    <div className="flex-direction">
      <div className="size">
        <div className="size-profil">
          <div className="bor-username">
            <div>{profil.username}</div>
          </div>
          <div className="flex-elt-profil">
            <div className="flex-picturs">
              <div className="size-police-photo">Photo de profil</div>
              <img alt="img" className="size-picturs" src={profil.avatar} />
              <div className="modal-show" onClick={openModal}>
                Select
              </div>
              {active && (
                <Modal setActive={setActive} active={active}>
                  <Avatar close={closeModal} onChangeAvatar={onChangeAvatar} />
                </Modal>
              )}
            </div>
            <div className="size-elt">
              <div className="email">
                <div className="size-police">E-mail</div>
                <div>{profil.email}</div>
              </div>
              <div>
                <div className="size-police">Description</div>
                {profil.bio ? (
                  <div className="margin-bio">{profil.bio}</div>
                ) : (
                  <div className="margin-bio">Votre description est vide</div>
                )}
                <div className="flex-bio">
                  <textarea className="textarea" onChange={onChangeBio} label="Ajouter votre description" />
                  <button onClick={updateProfilBio} className="button" type="button">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-drop-update">
            <div>
              <UpdadePassword />
            </div>
            <div>
              <DropAccount userId={profil.id} setIsLoggedin={setIsLoggedin} />
            </div>
          </div>
        </div>
        <div className="flex-msg">
          <MessageUserMe admin={admin} avatar={profil.avatar} myUserId={profil.id} />
        </div>
      </div>
    </div>
  ) : null;
};
export default ProfilPage;
