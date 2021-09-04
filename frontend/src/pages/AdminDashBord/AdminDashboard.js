import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import { toastTrigger } from "../../helper/toast";
import "./admindashboard.scss";

const AdminDashboard = ({ setMyUserId, isLoggedin, setIsLoggedin, setDataUser, setAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [valueError, setValueError] = useState("");
  const [compteurNewPassword, setCompteurNewPassword] = useState(0);
  const [classNameNewPassWord, setClassNameNewPassWord] = useState("");
  const [compteurUppercase, setCompteurUppercase] = useState(0);
  const [classNameUppercase, setClassNameUppercase] = useState("");
  const [compteurLowercase, setCompteurLowercase] = useState(0);
  const [classNameLowercase, setClassNameLowercase] = useState("");
  const [compteurNumber, setCompteurNumber] = useState(0);
  const [classNameNumber, setClassNameNumber] = useState("");
  const [compteurCharacter, setCompteurCharacter] = useState(0);
  const [classNameCharacter, setClassNameCharacter] = useState("");
  const [compteurUserName, setCompteurUserName] = useState(0);
  const [classNameUserName, setClassNameUserName] = useState("");
  const [activeUppercase, setActiveUppercase] = useState(false);
  const [active, setActive] = useState(false);
  const clickOutSide = useRef();
  const clickOutSideError = useRef();
  const history = useHistory();
  const [verifGroupo, setVerifGroupo] = useState("");
  const [classNameGroupo, setClassNameGroupo] = useState("");

  const handleClickOutside = (e) => {
    if (!clickOutSide.current?.contains(e.target)) {
      setActiveUppercase(false);
    }
  };

  const handleClickOutsideError = (e) => {
    if (!clickOutSideError.current?.contains(e.target)) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideError);
    return () => document.removeEventListener("mousedown", handleClickOutsideError);
  });

  useEffect(() => {
    if (compteurNewPassword < 8) {
      setClassNameNewPassWord("color-red");
    } else {
      setClassNameNewPassWord("color-green");
    }
    if (compteurUppercase < 1) {
      setClassNameUppercase("color-red");
    } else {
      setClassNameUppercase("color-green");
    }
    if (compteurLowercase < 1) {
      setClassNameLowercase("color-red");
    } else {
      setClassNameLowercase("color-green");
    }
    if (compteurNumber < 1) {
      setClassNameNumber("color-red");
    } else {
      setClassNameNumber("color-green");
    }
    if (compteurCharacter < 1) {
      setClassNameCharacter("color-red");
    } else {
      setClassNameCharacter("color-green");
    }
    if (compteurUserName < 4 || compteurUserName > 12) {
      setClassNameUserName("color-red");
    } else {
      setClassNameUserName("color-green");
    }
    if (verifGroupo) {
      let matchGroupo = verifGroupo.split("@");

      if (matchGroupo[1] !== "groupomania.com") {
        setClassNameGroupo("color-red");
      } else {
        setClassNameGroupo("color-green");
      }
    }
  }, [
    compteurNewPassword,
    compteurUppercase,
    compteurLowercase,
    compteurNumber,
    compteurCharacter,
    compteurUserName,
    verifGroupo,
  ]);

  const onChangeEmail = (e) => {
    setVerifGroupo(e.target.value);
    setEmail(e.target.value);
    setValueError("");
  };

  const onChangePassword = (e) => {
    const regexUppercase = /[A-Z]/g;
    let findLengthUppercase = e.target.value.match(regexUppercase);
    if (findLengthUppercase) {
      findLengthUppercase = findLengthUppercase.length;
    }
    const regexLowercase = /[a-z]/g;
    let findLengthLowercase = e.target.value.match(regexLowercase);
    if (findLengthLowercase) {
      findLengthLowercase = findLengthLowercase.length;
    }
    const regexNumber = /[0-9]/g;
    let findLengthNumber = e.target.value.match(regexNumber);
    if (findLengthNumber) {
      findLengthNumber = findLengthNumber.length;
    }
    const regexCharacter = /[_\W]/g;
    let findLengthCharacter = e.target.value.match(regexCharacter);
    if (findLengthCharacter) {
      findLengthCharacter = findLengthCharacter.length;
    }
    setCompteurCharacter(findLengthCharacter);
    setCompteurNumber(findLengthNumber);
    setCompteurLowercase(findLengthLowercase);
    setCompteurUppercase(findLengthUppercase);
    setCompteurNewPassword(e.target.value.length);
    setPassword(e.target.value);
    setActiveUppercase(true);
    setValueError("");
  };

  const onChangeUsername = (e) => {
    setCompteurUserName(e.target.value.length);
    setUsername(e.target.value);
    setValueError("");
  };

  const onSignUp = async () => {
    let token;
    if (compteurNewPassword < 8) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurUppercase < 1) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurLowercase < 1) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurNumber < 1) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurCharacter < 1) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurUserName < 4 || compteurUserName > 12) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    try {
      const response = await api.post("/users/admin", {
        email,
        password,
        username,
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
      } catch (error) {}
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
      setCompteurUserName(0);
      setCompteurUppercase(0);
      setCompteurNumber(0);
      setCompteurLowercase(0);
      setCompteurCharacter(0);
      setCompteurNewPassword(0);
      setActiveUppercase(false);
      setActive(false);
      setVerifGroupo("");
      history.push("/");
    } catch (error) {
      setValueError(error.response.data.error);
    }
  };

  return (
    <div className="sign-in-flex">
      <div className="lmj-main-sign-in">
        <div ref={clickOutSide} className="lmj-flex">
          <div>Admin</div>
          <div className="element-size">
            <Input style={{ width: "100%" }} onChange={onChangeEmail} value={email} label="Email" type="email" />
            <div>{verifGroupo && <div className={classNameGroupo}>Doit finir par "@groupomania.com" </div>}</div>
          </div>
          <div className="element-marge  element-size">
            <Input
              style={{ width: "100%" }}
              onChange={onChangePassword}
              value={password}
              label="Password"
              type="password"
            />
            <div>
              {compteurNewPassword > 0 && (
                <div className={classNameNewPassWord}>Minimum de caratère : {compteurNewPassword}/8</div>
              )}
            </div>
            <div>{activeUppercase && <div className={classNameUppercase}>Minimum 1 majuscule </div>}</div>
            <div>{activeUppercase && <div className={classNameLowercase}>Minimum 1 minuscule </div>}</div>
            <div>{activeUppercase && <div className={classNameNumber}>Minimum 1 chiffre </div>}</div>
            <div>{activeUppercase && <div className={classNameCharacter}>Minimum 1 charatère spécial </div>}</div>
          </div>
          <div className="element-marge  element-size">
            <Input style={{ width: "100%" }} onChange={onChangeUsername} value={username} label="Username" />
            <div>
              {compteurUserName > 0 && (
                <div className={classNameUserName}>Minimum de caratère : {compteurUserName}/4</div>
              )}
            </div>
          </div>
          {valueError && <div>{valueError}</div>}
          <div className="element-marge">
            <Button onClick={onSignUp} title="Valider" />
          </div>
          {active && (
            <div ref={clickOutSideError} className="color-red">
              Vériffiez vos information de saisie
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
