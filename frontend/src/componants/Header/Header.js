import { useState, useEffect } from "react";
import "./header.scss";
import logo from "../../assets/logos/icon-left-font.png";
import Button from "../Button/Button";
import { useHistory, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Header = ({ isLoggedin, myUserId, setIsLoggedin, setCheckLogin, setMyUserId }) => {
  const history = useHistory();
  const [profilPageIsActif, setprofilPageIsActif] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profil") {
      setprofilPageIsActif(true);
    } else {
      setprofilPageIsActif(false);
    }
  }, [location.pathname]);
  const onLogout = () => {
    setIsLoggedin(false);
    setCheckLogin(false);
    sessionStorage.removeItem("groupomaniaToken");
    setMyUserId("");
    history.push("/connexion");
  };

  return (
    <div className="lmj-banner flex">
      <div className="image-rognage">
        <img src={logo} alt="Groupomania" className="lmj-logo" />
      </div>

      {isLoggedin && <SearchBar myUserId={myUserId} />}
      {isLoggedin ? (
        isLoggedin && !profilPageIsActif ? (
          <Button onClick={() => history.push("/profil")} title="profil" />
        ) : (
          <Button onClick={() => history.push("/")} title="Accueil" />
        )
      ) : (
        <></>
      )}

      {isLoggedin ? (
        <Button onClick={onLogout} title="Déconexion" />
      ) : (
        <Button onClick={() => history.push("/inscription")} title="Inscription" />
      )}
    </div>
  );
};
export default Header;
