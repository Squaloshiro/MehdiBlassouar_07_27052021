import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import MessageUserMe from "../MessageUser/MessageUserMe";
import "./profilPage.scss";
import Avatar from "../Avatars/Avatars";
import UpdadePassword from "../../componants/UpdatPassword/UpdatePassword";
import DropAccount from "../../componants/DropAccount/DropAccount";
import Modal from "../../componants/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../componants/Button/Button";
import TextArea from "../../componants/TextArea/InputTextArea";

const ProfilPage = ({ setIsLoggedin, admin, myUserId, setAvatar, setUserNewName, avatar }) => {
  const [profil, setProfil] = useState({});
  const [bio, setBio] = useState("");
  const [username, setUserName] = useState("");
  const [active, setActive] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [activeBio, setActiveBio] = useState(false);
  const [activeError, setActiveError] = useState("");
  const clickOutSide = useRef();
  const clickOutSideBio = useRef();

  const handleClickOutside = (e) => {
    if (!clickOutSide.current?.contains(e.target)) {
      setActiveUser(false);
    }
  };
  const handleClickOutsideBio = (e) => {
    if (!clickOutSideBio.current?.contains(e.target)) {
      setActiveBio(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideBio);
    return () => document.removeEventListener("mousedown", handleClickOutsideBio);
  });

  const onChangeAvatar = (newAvatar) => {
    setAvatar(newAvatar.avatar);
    setProfil(newAvatar);
  };
  const onChangeUserName = (e) => {
    setActiveError("");
    setUserName(e.target.value);
  };
  const onChangeBio = (e) => {
    setBio(e.target.value);
  };
  const clickModifUser = () => {
    setActiveUser(true);
  };
  const clickModifBio = () => {
    setActiveBio(true);
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
      } catch (error) {}
    };
    getProfilUser();
  }, []);

  const updateProfilBio = async () => {
    const obj = { bio };
    if (bio === "") {
      setActiveBio(false);

      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/me/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setBio("");
      setActiveBio(false);
      setProfil(response.data);
    } catch (error) {}
  };

  const updateProfilUsername = async () => {
    const obj = { username };
    if (username === "") {
      setActiveUser(false);

      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/name/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setUserName("");
      setActiveUser(false);
      setProfil(response.data);
      setUserNewName(response.data.username);
    } catch (error) {
      setUserName("");
      setActiveError(error.response.data.error);
    }
  };

  return profil?.id ? (
    <div className="flex-direction">
      <div className="size">
        <div className="size-profil">
          <div className="avtar-user-mail">
            <div className="flex-picturs">
              <img alt="img" className="size-picturs" onClick={openModal} src={profil.avatar} />

              <Button onClick={openModal} title="selecte" />

              {active && (
                <Modal setActive={setActive} active={active}>
                  <Avatar profil={profil} close={closeModal} onChangeAvatar={onChangeAvatar} />
                </Modal>
              )}
            </div>
            <div className="identity-user">
              {!activeUser ? (
                <div className="bor-username">
                  <div>{profil.username}</div>
                  <div className="pen">
                    <FontAwesomeIcon onClick={clickModifUser} color="blue" icon={["fas", "pen"]} />
                  </div>
                </div>
              ) : (
                <div ref={clickOutSide} className="bor-username">
                  <TextArea
                    variant="outlined"
                    rows={1}
                    onChange={onChangeUserName}
                    value={username}
                    label={profil.username}
                  />
                  {activeError && <div>{activeError}</div>}
                  <Button onClick={updateProfilUsername} color="primary" title="Modifier" />
                </div>
              )}
              <div className="email">
                <div className="size-police">E-mail :</div>
                <div>{profil.email}</div>
              </div>
            </div>
          </div>
          <div className="flex-elt-profil">
            <div className="size-elt">
              <div className="description-position">
                <div className="description-view">
                  <div className="size-police">Description</div>
                  {profil.bio ? (
                    <div className="margin-bio">{profil.bio}</div>
                  ) : (
                    <div className="margin-bio">Votre description est vide</div>
                  )}
                </div>
                <div className="textarea-description-position">
                  {!activeBio ? (
                    <div className="pen">
                      <FontAwesomeIcon onClick={clickModifBio} color="blue" icon={["fas", "pen"]} />
                    </div>
                  ) : (
                    <div ref={clickOutSideBio} className="flex-bio">
                      <textarea
                        className="textarea"
                        value={bio}
                        onChange={onChangeBio}
                        placeholder="Ajouter votre description"
                      />
                      <button onClick={updateProfilBio} className="button" type="button">
                        Envoyer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-drop-update">
            <div className="update-password">
              <UpdadePassword />
            </div>
            <div className="drop-account">
              <DropAccount userId={profil.id} setIsLoggedin={setIsLoggedin} />
            </div>
          </div>
        </div>
        <div className="flex-msg">
          <MessageUserMe
            avatarAdmin={avatar}
            admin={admin}
            username={profil.username}
            avatar={profil.avatar}
            myUserId={profil.id}
          />
        </div>
      </div>
    </div>
  ) : null;
};
export default ProfilPage;
