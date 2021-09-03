import { useHistory } from "react-router";
import "./error404.scss";
import error404 from "../../assets/erreur-page-404.png";
import Button from "../Button/Button";

const Error404 = () => {
  const history = useHistory();

  return (
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
