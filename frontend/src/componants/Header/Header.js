import { useState, useEffect } from "react";
import "./header.scss";
import logo from "../../assets/logos/mon_icon_4.png";
import icon from "../../assets/logos/mon_icon_10.png";
import Button from "../Button/Button";
import { useHistory, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useLoggin from "../../helper/useLoggin";
const Header = ({
  setAvatar,

  myUserId,

  setCheckLogin,
  setMyUserId,
  avatar,
  setAdmin,
  userNewName,
  setDataUser,
  dataUser,
}) => {
  const history = useHistory();
  const loggin = useLoggin();
  const home = <FontAwesomeIcon icon={["fas", "home"]} />;
  const user = <FontAwesomeIcon icon={["fas", "user"]} />;
  const logOut = <FontAwesomeIcon icon={["fas", "sign-out-alt"]} />;
  const logIn = <FontAwesomeIcon icon={["fas", "sign-in-alt"]} />;
  const [profilPageIsActif, setprofilPageIsActif] = useState(false);
  const [userProfilPageIsActif, setUserProfilPageIsActif] = useState(false);
  const [signUpPage, setSignUpPage] = useState(false);
  const [pointorActive, setPointorActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profil") {
      setSignUpPage(false);
      setprofilPageIsActif(true);
      setUserProfilPageIsActif(false);
    } else if (location.pathname === "/users/profils") {
      setSignUpPage(false);
      setprofilPageIsActif(true);
      setUserProfilPageIsActif(true);
    } else if (location.pathname === "/inscription") {
      setSignUpPage(true);
    } else {
      setSignUpPage(false);
      setprofilPageIsActif(false);
      setUserProfilPageIsActif(false);
    }
  }, [location.pathname, pointorActive]);

  useEffect(() => {
    if (location.pathname === "/") {
      setPointorActive(true);
    } else {
      setPointorActive(false);
    }
  }, [location.pathname]);

  const onLogout = () => {
    loggin.onLoggOut();
    setCheckLogin(false);
    sessionStorage.removeItem("groupomaniaToken");
    setMyUserId("");
    setAdmin(false);
    setAvatar("");
    history.push("/connexion");
  };

  return (
    <div className="lmj-banner flex">
      <div className="image-rognage">
        <img
          onClick={() => history.push("/")}
          src={logo}
          alt="Groupomania"
          className={`${pointorActive ? "lmj-logo-2" : "lmj-logo"}`}
        />
        <img
          onClick={() => history.push("/")}
          src={icon}
          alt="Groupomania"
          className={`${pointorActive ? "lmj-icon-2" : "lmj-icon"}`}
        />
      </div>

      {loggin.isLoggedin && (
        <SearchBar
          className="search-bar-header"
          setDataUser={setDataUser}
          dataUser={dataUser}
          userNewName={userNewName}
          avatar={avatar}
          myUserId={myUserId}
        />
      )}
      <div className="button_position">
        {loggin.isLoggedin ? (
          loggin.isLoggedin && !profilPageIsActif ? (
            <Button onClick={() => history.push("/profil")} title={user} />
          ) : (
            <Button onClick={() => history.push("/")} title={home} />
          )
        ) : (
          <></>
        )}
        {loggin.isLoggedin && userProfilPageIsActif && <Button onClick={() => history.push("/profil")} title={user} />}
        {loggin.isLoggedin ? (
          <Button onClick={onLogout} title={logOut} />
        ) : !signUpPage ? (
          <Button onClick={() => history.push("/inscription")} title="Inscription" />
        ) : (
          <Button onClick={() => history.push("/connexion")} title={logIn} />
        )}
      </div>
    </div>
  );
};
export default Header;
