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
const ProfilPage = ({
  admin,
  isLoggedin,
  setIsLoggedin,
  myUserId,
  setDataUser,
  setAvatar,
  setFirstNewName,
  setLastNewName,
  setNewEmail,
  avatar,
}) => {
  const [profil, setProfil] = useState({});
  const [bio, setBio] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [activeLastName, setActiveLastName] = useState(false);
  const [activeEmail, setActiveEmail] = useState(false);
  const [activeBio, setActiveBio] = useState(false);
  const [activeError, setActiveError] = useState("");
  const [compteurBio, setCompteurBio] = useState(0);
  const [compteurFirstName, setCompteurFirstName] = useState(0);
  const [compteurLastName, setCompteurLastName] = useState(0);
  const [maxBio, setmaxBio] = useState("");
  const [classNameBio, setClassNameBio] = useState("color-green");
  const [classNameFirstName, setClassNameFirstName] = useState("color-green-username");
  const [classNameLastName, setClassNameLastName] = useState("color-green-username");
  const [verifGroupo, setVerifGroupo] = useState("");
  const [classNameGroupo, setClassNameGroupo] = useState("");
  const clickOutSide = useRef();
  const clickOutSideLastName = useRef();
  const clickOutSideEmail = useRef();
  const clickOutSideBio = useRef();
  const history = useHistory();
  const handleClickOutside = (e) => {
    if (!clickOutSide.current?.contains(e.target)) {
      setActiveUser(false);
      setActiveError("");
      setFirstName("");
      setCompteurFirstName(0);
    }
  };
  const handleClickOutsideLastName = (e) => {
    if (!clickOutSideLastName.current?.contains(e.target)) {
      setActiveLastName(false);
      setActiveError("");
      setLastName("");
      setCompteurLastName(0);
    }
  };
  const handleClickOutsideEmail = (e) => {
    if (!clickOutSideEmail.current?.contains(e.target)) {
      setActiveEmail(false);
      setActiveError("");
      setEmail("");

      setVerifGroupo("");
    }
  };

  const handleClickOutsideBio = (e) => {
    if (!clickOutSideBio.current?.contains(e.target)) {
      setActiveBio(false);
      setCompteurBio(0);
      setBio("");
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
    if (compteurFirstName < 4 || compteurFirstName > 12) {
      setClassNameFirstName("color_red_username");
    } else {
      setClassNameFirstName("color-green_username");
    }
    if (compteurLastName < 4 || compteurLastName > 12) {
      setClassNameLastName("color_red_username");
    } else {
      setClassNameLastName("color-green_username");
    }

    if (verifGroupo) {
      let matchGroupo = verifGroupo.split("@");

      if (matchGroupo[1] !== "groupomania.com") {
        setClassNameGroupo("color-red");
      } else {
        setClassNameGroupo("color-green");
      }
    }
  }, [compteurBio, compteurFirstName, compteurLastName, verifGroupo]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideLastName);
    return () => document.removeEventListener("mousedown", handleClickOutsideLastName);
  });
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideEmail);
    return () => document.removeEventListener("mousedown", handleClickOutsideEmail);
  });
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideBio);
    return () => document.removeEventListener("mousedown", handleClickOutsideBio);
  });

  const onChangeAvatar = (newAvatar) => {
    setAvatar(newAvatar.avatar);
    setProfil(newAvatar);
  };
  const onChangeFirstName = (e) => {
    setActiveError("");
    setCompteurFirstName(e.target.value.length);
    setFirstName(e.target.value);
  };
  const onChangeLastName = (e) => {
    setActiveError("");
    setCompteurLastName(e.target.value.length);
    setLastName(e.target.value);
  };
  const onChangeEmail = (e) => {
    setVerifGroupo(e.target.value);

    setEmail(e.target.value);
    setActiveError("");
  };
  const onChangeBio = (e) => {
    setCompteurBio(e.target.value.length);
    setBio(e.target.value);
  };
  const clickModifUser = () => {
    setActiveUser(true);
  };
  const clickModifLastName = () => {
    setActiveLastName(true);
  };
  const clickModifEmail = () => {
    setActiveEmail(true);
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
      toastTrigger("error", "une erreur est survenue");
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

  const updateProfilFirstName = async () => {
    const obj = { firstName };
    if (firstName === "") {
      setActiveUser(false);
      setFirstName("");
      setCompteurFirstName(0);

      return;
    }

    if (compteurFirstName < 4 || compteurFirstName > 12) {
      toastTrigger("error", "une erreur est survenue");
      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/firstname/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setActiveUser(false);
      setProfil(response.data);
      setFirstName("");
      setCompteurFirstName(0);
      setFirstNewName(response.data.firstName);

      toastTrigger("success", "Prénom modifié");
    } catch (error) {
      setFirstName("");
      setActiveError(error.response.data.error);
    }
  };

  const updateProfilLastName = async () => {
    const obj = { lastName };
    if (lastName === "") {
      setActiveLastName(false);
      setFirstName("");
      setCompteurFirstName(0);

      return;
    }

    if (compteurLastName < 4 || compteurLastName > 12) {
      toastTrigger("error", "une erreur est survenue");
      return;
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/lastname/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setActiveLastName(false);
      setProfil(response.data);
      setLastName("");
      setCompteurLastName(0);

      setLastNewName(response.data.lastName);
      toastTrigger("success", "Nom modifié");
    } catch (error) {
      setLastName("");
      setActiveError(error.response.data.error);
    }
  };

  const updateProfilEmail = async () => {
    const obj = { email };

    if (verifGroupo) {
      let matchGroupo = verifGroupo.split("@");

      if (matchGroupo[1] !== "groupomania.com") {
        setActiveEmail(true);
        return;
      }
    }
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/email/",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      setActiveEmail(false);
      setProfil(response.data);
      setActiveError("");
      setEmail("");

      setVerifGroupo("");
      setNewEmail(response.data.email);

      toastTrigger("success", "Email modifié");
    } catch (error) {
      setEmail("");
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

              <Button onClick={openModal} title="select" />

              {active && (
                <Modal onClick={closeModal} setActive={setActive} active={active}>
                  <Avatar profil={profil} onClick={closeModal} onChangeAvatar={onChangeAvatar} />
                </Modal>
              )}
            </div>
            <div className="identity-user">
              {!activeUser ? (
                <div className="bor-username">
                  <div className="usernam-page-profil">{profil.firstName}</div>
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
                        onChange={onChangeFirstName}
                        value={firstName}
                        label={profil.firstName}
                      />
                      {compteurFirstName > 0 && (
                        <div className={classNameFirstName}>Limite de caractère : {compteurFirstName}/12</div>
                      )}
                    </div>

                    <Button onClick={updateProfilFirstName} color="primary" title="Modifier" />
                  </div>
                  {activeError && <div className="color_red">{activeError}</div>}
                </div>
              )}
              {!activeLastName ? (
                <div className="bor-username">
                  <div className="usernam-page-profil">{profil.lastName}</div>
                  <div className="pen">
                    <FontAwesomeIcon onClick={clickModifLastName} color="blue" icon={["fas", "pen"]} />
                  </div>
                </div>
              ) : (
                <div className="error-position">
                  <div ref={clickOutSideLastName} className="bor-username">
                    <div className="username-positon-update">
                      <TextArea
                        variant="outlined"
                        rows={1}
                        onChange={onChangeLastName}
                        value={lastName}
                        label={profil.lastName}
                      />
                      {compteurLastName > 0 && (
                        <div className={classNameLastName}>Limite de caractère : {compteurLastName}/12</div>
                      )}
                    </div>

                    <Button onClick={updateProfilLastName} color="primary" title="Modifier" />
                  </div>
                  {activeError && <div className="color_red">{activeError}</div>}
                </div>
              )}
              {!activeEmail ? (
                <div className="email">
                  <div className="size-police">E-mail :</div>
                  <div>{profil.email}</div>
                  <div className="pen">
                    <FontAwesomeIcon onClick={clickModifEmail} color="blue" icon={["fas", "pen"]} />
                  </div>
                </div>
              ) : (
                <div className="error-position">
                  <div ref={clickOutSideEmail} className="bor-username">
                    <div className="username-positon-update">
                      <TextArea
                        variant="outlined"
                        rows={1}
                        onChange={onChangeEmail}
                        value={email}
                        label={profil.email}
                      />
                      <div>
                        {verifGroupo && <div className={classNameGroupo}>Doit finir par "@groupomania.com" </div>}
                      </div>
                    </div>

                    <Button onClick={updateProfilEmail} color="primary" title="Modifier" />
                  </div>
                  {activeError && <div className="color_red">{activeError}</div>}
                </div>
              )}
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
                    <div className="size-text-area-page-profil">
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
            firstName={profil.firstName}
            lastName={profil.lastName}
            avatar={profil.avatar}
            myUserId={profil.id}
          />
        </div>
      </div>
    </div>
  ) : null;
};
export default ProfilPage;
