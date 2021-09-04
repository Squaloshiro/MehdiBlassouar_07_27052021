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
import { toastTrigger } from "../../helper/toast";
import { useHistory } from "react-router";
const ProfilPage = ({ admin, isLoggedin, setIsLoggedin, myUserId, setDataUser, setAvatar, setUserNewName, avatar }) => {
  const [profil, setProfil] = useState({});
  const [bio, setBio] = useState("");

  const [username, setUserName] = useState("");
  const [active, setActive] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [activeBio, setActiveBio] = useState(false);
  const [activeError, setActiveError] = useState("");
  const [compteurBio, setCompteurBio] = useState(0);
  const [compteurUserName, setCompteurUserName] = useState(0);
  const [maxBio, setmaxBio] = useState("");
  const [classNameBio, setClassNameBio] = useState("color-green");
  const [classNameUserName, setClassNameUserName] = useState("color-green-username");
  const clickOutSide = useRef();
  const clickOutSideBio = useRef();
  const history = useHistory();
  const handleClickOutside = (e) => {
    if (!clickOutSide.current?.contains(e.target)) {
      setActiveUser(false);
      setActiveError("");
      setUserName("");
      setCompteurUserName(0);
    }
  };
  const handleClickOutsideBio = (e) => {
    if (!clickOutSideBio.current?.contains(e.target)) {
      setActiveBio(false);
    }
  };

  useEffect(() => {
    if (compteurBio > 2550) {
      setClassNameBio("color_red");
      setmaxBio("atteind");
    } else {
      setClassNameBio("color-green");
      setmaxBio("");
    }
    if (compteurUserName < 4 || compteurUserName > 12) {
      setClassNameUserName("color_red_username");
    } else {
      setClassNameUserName("color-green_username");
    }
  }, [compteurBio, compteurUserName]);

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
    setCompteurUserName(e.target.value.length);
    setUserName(e.target.value);
  };
  const onChangeBio = (e) => {
    setCompteurBio(e.target.value.length);
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
      } catch (error) {
        history.push("/connexion");
      }
    };
    getProfilUser();
  }, [history]);

  const updateProfilBio = async () => {
    const obj = { bio };
    if (bio === "") {
      setActiveBio(false);

      return;
    }
    if (compteurBio > 2550) {
      toastTrigger("error", "une erreur est survenu");
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
      setCompteurBio(0);
      setProfil(response.data);
    } catch (error) {}
  };

  const updateProfilUsername = async () => {
    const obj = { username };
    if (username === "") {
      setActiveUser(false);
      setUserName("");
      setCompteurUserName(0);

      return;
    }

    if (compteurUserName < 4 || compteurUserName > 12) {
      toastTrigger("error", "une erreur est survenu");
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
      try {
        const response = await api({
          method: "get",
          url: "/users/all",
          headers: { Authorization: `Bearer ${token}` },
        });
        setDataUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenu");
      }
      setUserName("");
      setActiveUser(false);
      setProfil(response.data);
      setUserName("");
      setCompteurUserName(0);
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
                <Modal onClick={closeModal} setActive={setActive} active={active}>
                  <Avatar profil={profil} onClick={closeModal} onChangeAvatar={onChangeAvatar} />
                </Modal>
              )}
            </div>
            <div className="identity-user">
              {!activeUser ? (
                <div className="bor-username">
                  <div className="usernam-page-profil">{profil.username}</div>
                  <div className="pen">
                    <FontAwesomeIcon onClick={clickModifUser} color="blue" icon={["fas", "pen"]} />
                  </div>
                </div>
              ) : (
                <div className="error-position">
                  <div ref={clickOutSide} className="bor-username">
                    <div className="username-positon-update">
                      <TextArea
                        variant="outlined"
                        rows={1}
                        onChange={onChangeUserName}
                        value={username}
                        label={profil.username}
                      />
                      {compteurUserName > 0 && (
                        <div className={classNameUserName}>Limite de caractère : {compteurUserName}/12</div>
                      )}
                    </div>

                    <Button onClick={updateProfilUsername} color="primary" title="Modifier" />
                  </div>
                  {activeError && <div className="color_red">{activeError}</div>}
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
                    <div>
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
                      {compteurBio > 0 && (
                        <div className={classNameBio}>
                          Limite de caractère {maxBio} : {compteurBio}/2550
                        </div>
                      )}
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
              <DropAccount isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} userId={profil.id} />
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
