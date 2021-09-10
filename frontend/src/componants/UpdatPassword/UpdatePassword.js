import { useState, useEffect, useRef } from "react";
import api from "../../config/api";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";
import "./updatepassword.scss";
const UpdadePassword = () => {
  const [oldPassword, setOldPasseword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [valueError, setValueError] = useState("");
  const [compteurOldPassword, setCompteurOldPassword] = useState(0);
  const [classNameOldPassWord, setClassNameOldPassWord] = useState("");
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
  const [activeUppercase, setActiveUppercase] = useState(false);
  const [active, setActive] = useState(false);
  const clickOutSide = useRef();
  const clickOutSideError = useRef();

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
    if (compteurOldPassword < 8) {
      setClassNameOldPassWord("color-red");
    } else {
      setClassNameOldPassWord("color-green");
    }
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
  }, [
    compteurOldPassword,
    compteurNewPassword,
    compteurUppercase,
    compteurLowercase,
    compteurNumber,
    compteurCharacter,
  ]);

  const onChangeOldPassword = (e) => {
    setCompteurOldPassword(e.target.value.length);
    setOldPasseword(e.target.value);
    setValueError("");
  };

  const onChangeNewPassWord = (e) => {
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
    setNewPassword(e.target.value);
    setActiveUppercase(true);
    setValueError("");
  };

  const updateProfilBio = async () => {
    const obj = { oldPassword, newPassword };
    if (compteurOldPassword < 8) {
      setActiveUppercase(false);
      setActive(true);
      return;
    }
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
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      await api({
        method: "put",
        url: "/users/password",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setCompteurOldPassword(0);
      setOldPasseword("");
      setNewPassword("");
      setCompteurUppercase(0);
      setCompteurNumber(0);
      setCompteurLowercase(0);
      setCompteurCharacter(0);
      setActiveUppercase(false);
      setCompteurNewPassword(0);
      setActive(false);
      toastTrigger("success", "Mots de passe modifié");
    } catch (error) {
      toastTrigger("error", "une erreur est survenue");
      setValueError(error.response.data.error);
    }
  };

  return (
    <div ref={clickOutSide} className="size-update-password">
      <div className="old-password-position">
        <Input onChange={onChangeOldPassword} type="password" value={oldPassword} label="Ancien mots de passe" />
        <div>
          {compteurOldPassword > 0 && (
            <div className={classNameOldPassWord}>Minimum de caratère : {compteurOldPassword}/8</div>
          )}
        </div>
      </div>
      <div>
        <Input onChange={onChangeNewPassWord} type="password" value={newPassword} label="Nouveau mots de passe" />
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
      {active && (
        <div ref={clickOutSideError} className="color-red">
          Vériffiez vos information de saisie
        </div>
      )}
      {valueError && <div ref={clickOutSideError}>{valueError}</div>}
      <div>
        <Button onClick={updateProfilBio} title="Envoyer" />
      </div>
    </div>
  );
};

export default UpdadePassword;
