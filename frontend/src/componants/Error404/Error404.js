import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import "./error404.scss";
import error404 from "../../assets/erreur-page-404.png";
import Button from "../Button/Button";
import logo from "../../assets/logos/mon_icon_4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Error404 = () => {
  const history = useHistory();
  const [show404, setShow404] = useState(true);
  useEffect(() => {
    const error = setTimeout(() => {
      setShow404(false);
    }, 3000);
    return () => clearTimeout(error);
  }, [show404, setShow404]);
  return show404 ? (
    <div className="loadcontent">
      <div className="imgloader">
        <img src={logo} alt="images du logo de oh my food" />
      </div>
      <div className="load">
        <div className="logoSpinner">
          <FontAwesomeIcon color="black" icon={["fas", "spinner"]} size="3x" />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="eror-position">
        <img height="100%" width="100%" alt="img" src={error404} />
      </div>
      <div className="error-flex">
        <div className="button-error">
          <Button onClick={() => history.push("/")} type="button" title="  revenir a l'acceuil" />
        </div>
      </div>
    </div>
  );
};
export default Error404;
