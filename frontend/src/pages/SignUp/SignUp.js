import Input from "../../componants/Input/Input";
import Button from "../../componants/Button/Button";
import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import { useHistory } from "react-router";
import { toastTrigger } from "../../helper/toast";
import "./signup.scss";

const SignUp = ({
  setMyUserId,
  isLoggedin,
  setFirstNewName,
  setNewEmail,
  setLastNewName,
  setDataUser,
  setIsLoggedin,
  setAdmin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmePassword, setConfirmePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [valueErrorFirstName, setValueErrorFirstName] = useState("");
  const [valueErrorLastName, setValueErrorLastName] = useState("");
  const [valueError, setValueError] = useState("");
  const [valueErrorConfirmPassword, setValueErrorConfirmPassword] = useState("");
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
  const [compteurFirstName, setCompteurFirstName] = useState(0);
  const [compteurLastName, setCompteurLastName] = useState(0);
  const [classNameFirstName, setClassNameFirstName] = useState("color-green-username");
  const [classNameLastName, setClassNameLastName] = useState("color-green-username");

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
    if (compteurFirstName < 1 || compteurFirstName > 12) {
      setClassNameFirstName("color_red_username");
    } else {
      setClassNameFirstName("color-green_username");
    }
    if (compteurLastName < 1 || compteurLastName > 12) {
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
  }, [
    compteurNewPassword,
    compteurUppercase,
    compteurLowercase,
    compteurNumber,
    compteurCharacter,
    compteurFirstName,
    compteurLastName,
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
  const onChangeConfirmPassword = (e) => {
    setConfirmePassword(e.target.value);

    setValueErrorConfirmPassword("");
  };

  const onChangeFirstName = (e) => {
    setValueErrorFirstName("");
    setCompteurFirstName(e.target.value.length);
    setFirstName(e.target.value);
  };
  const onChangeLastName = (e) => {
    setValueErrorLastName("");
    setCompteurLastName(e.target.value.length);
    setLastName(e.target.value);
  };

  const onSignUp = async () => {
    const regexCharacter = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*[ ]?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;
    const regexCharacter1 = /^([A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]*-?[A-zàâäçéèêëîïôùûüÿæœÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ]+$)$/;

    //let token;
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
    if (compteurFirstName < 1 || compteurFirstName > 12) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (compteurLastName < 1 || compteurLastName > 12) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
    if (verifGroupo) {
      let matchGroupo = verifGroupo.split("@");

      if (matchGroupo[1] !== "groupomania.com") {
        setActive(true);
        return;
      }
    }

    if (confirmePassword !== password) {
      toastTrigger("error", "une erreur est survenue");
      setValueErrorConfirmPassword("Vous n'avez pas saisie les même mots de passe");
    }
    if (!regexCharacter.test(lastName) && !regexCharacter1.test(lastName)) {
      setValueErrorLastName("Votre nom ne doit pas contenir des caractères spéciaux est des nombres");
    }

    if (!regexCharacter.test(firstName) && !regexCharacter1.test(firstName)) {
      setValueErrorFirstName("Votre prénom ne doit pas contenir des caractères spéciaux est des nombres");
    }
    if (lastName.length >= 13 || lastName.length < 0) {
      setValueErrorLastName("le nom doit être compris entre 1 et 12 lettres");
    }
    if (firstName.length >= 13 || firstName.length < 0) {
      setValueErrorFirstName("le prénom doit être compris entre 1 et 12 lettres");
    }

    try {
      await api.post("/users/register", {
        email,
        password,
        firstName,
        lastName,
        confirmePassword,
      });
      // token = response.data.token;
      //  sessionStorage.setItem("groupomaniaToken", response.data.token);
      // setIsLoggedin(true);
      /* try {
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
      } catch (error) {}*/
      /* try {
        const response = await api({
          method: "get",
          url: "/users/all",
          headers: { Authorization: `Bearer ${token}` },
        });
        setDataUser(response.data);
      } catch (error) {
        toastTrigger("error", "une erreur est survenue");
      }*/
      setCompteurFirstName(0);
      setCompteurLastName(0);
      setCompteurUppercase(0);
      setCompteurNumber(0);
      setCompteurLowercase(0);
      setCompteurCharacter(0);
      setCompteurNewPassword(0);
      setVerifGroupo("");
      setActiveUppercase(false);
      setActive(false);

      history.push("/connexion");
    } catch (error) {
      if (valueErrorConfirmPassword || valueErrorFirstName || valueErrorLastName) {
        setValueError("");
      } else {
        setValueError(error.response.data.error);
      }

      /* if (
        error.response.data.error !== "le nom doit être compris entre 1 et 12 lettres" ||
        error.response.data.error !== "Votre nom ne doit pas contenir des caractères spéciaux est des nombres" ||
        error.response.data.error !== "le prénom doit être compris entre 1 et 12 lettres" ||
        error.response.data.error !== "Votre prénom ne doit pas contenir des caractères spéciaux est des nombres"
      ) {
        setValueError(error.response.data.error);
      }*/
    }
  };

  return (
    <div className="sign-in-flex">
      <div className="lmj-main-sign-in">
        <div ref={clickOutSide} className="lmj-flex">
          <div>Inscription</div>
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
            <Input
              style={{ width: "100%" }}
              onChange={onChangeConfirmPassword}
              value={confirmePassword}
              label="Confirm password"
              type="password"
            />
          </div>
          {valueErrorConfirmPassword && <div className="color-red">{valueErrorConfirmPassword}</div>}

          <div className="element-marge  element-size">
            <Input style={{ width: "100%" }} onChange={onChangeFirstName} value={firstName} label="Firstname" />
            <div>
              {compteurFirstName > 0 && (
                <div className={classNameFirstName}>Minimum de caratère : {compteurFirstName}/1</div>
              )}
            </div>
            {valueErrorFirstName && <div className="color-red">{valueErrorFirstName}</div>}
          </div>
          <div className="element-marge  element-size">
            <Input style={{ width: "100%" }} onChange={onChangeLastName} value={lastName} label="LastName" />
            <div>
              {compteurLastName > 0 && (
                <div className={classNameLastName}>Minimum de caratère : {compteurLastName}/1</div>
              )}
            </div>
          </div>
          {valueErrorLastName && <div className="color-red">{valueErrorLastName}</div>}

          {valueError && <div className="color-red">{valueError}</div>}
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

export default SignUp;
