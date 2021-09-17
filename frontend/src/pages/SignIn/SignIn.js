import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import { toastTrigger } from "../../helper/toast";
import "./signin.scss";

const SignIn = ({
  setDataUser,
  setIsLoggedin,
  setLastNewName,
  setNewEmail,
  setFirstNewName,
  isLoggedin,
  setMyUserId,
  setAdmin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valueError, setValueError] = useState("");
  const history = useHistory();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    setValueError("");
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setValueError("");
  };

  const onSignIn = async () => {
    let token;
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });
      token = response.data.token;
      sessionStorage.setItem("groupomaniaToken", response.data.token);
      setIsLoggedin(true);

      try {
        const response = await api({
          url: "/users/me",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin(response.data.isAdmin);
        setMyUserId(response.data.id);

        setFirstNewName(response.data.firstName);
        setLastNewName(response.data.lastName);
        setNewEmail(response.data.email);
        toastTrigger("success", `Bonjour ${response.data.lastName + " " + response.data.firstName}`);
      } catch (error) {}
      try {
        const response = await api({
          method: "get",
          url: "/users/all",
          headers: { Authorization: `Bearer ${token}` },
        });

        setDataUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }
      history.push("/");
    } catch (error) {
      setValueError(error.response.data.error);
    }
  };

  return (
    <div className="sign-in-flex">
      <div className="lmj-main-sign-in">
        <div className="sign-in-position-center">
          <div className="lmj-flex">
            <div>Connexion</div>
            <div className="element-size">
              <Input style={{ width: "100%" }} onChange={onChangeEmail} value={email} label="Email" type="email" />
            </div>

            <div className="element-marge  element-size">
              <Input
                style={{ width: "100%" }}
                onChange={onChangePassword}
                value={password}
                label="Password"
                type="password"
              />
            </div>
            {valueError && <div className="color-red">{valueError}</div>}

            <div className="element-marge">
              <Button onClick={onSignIn} title="Valider" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
