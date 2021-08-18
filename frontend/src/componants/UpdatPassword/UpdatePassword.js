import { useState } from "react";
import api from "../../config/api";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { toastTrigger } from "../../helper/toast";
const UpdadePassword = () => {
  const [oldPassword, setOldPasseword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onChangeOldPassword = (e) => {
    setOldPasseword(e.target.value);
  };

  const onChangeNewPassWord = (e) => {
    setNewPassword(e.target.value);
  };

  const updateProfilBio = async () => {
    const obj = { oldPassword, newPassword };
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/password",
        data: obj,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      toastTrigger("success", "Mots de passe modifié");
      console.log("------------response.data------------------------");
      console.log(response.data);
      console.log("------------------------------------");
    } catch (error) {
      toastTrigger("error", "une erreur est survenu");
    }
  };

  return (
    <div>
      <div>
        <Input onChange={onChangeOldPassword} type="password" value={oldPassword} label="Ancien mots de passe" />
      </div>
      <div>
        <Input onChange={onChangeNewPassWord} type="password" value={newPassword} label="Nouveau mots de passe" />
      </div>
      <div>
        <Button onClick={updateProfilBio} title="Envoyer" />
      </div>
    </div>
  );
};

export default UpdadePassword;
