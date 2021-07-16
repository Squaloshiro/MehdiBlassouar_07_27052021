import { useState, useEffect } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageUserMe from "../MessageUser/MessageUserMe";
import "./profilPage.scss";
import Avatar from "../Avatars/Avatars";
const ProfilPage = () => {
  const history = useHistory();
  const [profil, setProfil] = useState({});
  const [bio, setBio] = useState("");

  const onChangeAvatar = (newAvatar) => {
    setProfil(newAvatar);
  };

  const onChangeBio = (e) => {
    setBio(e.target.value);
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
              <a class="modal-show" href="#modal">
                envoyer
              </a>

              <div class="modal" id="modal">
                <div class="modal-content">
                  <a class="modal-hide" href="#">
                    ✕
                  </a>
                  <div className="styl">
                    <Avatar onChangeAvatar={onChangeAvatar} />
                  </div>
                </div>
              </div>
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
        </div>
        <div className="flex-msg">
          <MessageUserMe avatar={profil.avatar} id={profil.id} />
        </div>
      </div>
    </div>
  ) : null;
};
export default ProfilPage;
