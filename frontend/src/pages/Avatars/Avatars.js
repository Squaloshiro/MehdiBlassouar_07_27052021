import { useState } from "react";
import api from "../../config/api";
import "./avatars.scss";

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(require.context("../../assets/avatars_grands", false, /\.(png|jpe?g|svg)$/));

const Card = ({ number, selectCardIndex }) => {
  return (
    <img
      className="radius-avatar"
      style={selectCardIndex === number ? { border: "1px solid black" } : null}
      name={images[`${number}.jpg`].default}
      src={images[`${number}.jpg`].default}
      alt={number}
      height={100}
      width={100}
    />
  );
};
const Avatar = ({ onChangeAvatar, onClick, profil }) => {
  const [avatar, setAvatars] = useState("");

  const [selectCardIndex, setSelectCardIndex] = useState(null);
  const tab = Array.from(Array(39).keys());
  const table = Array.from(Array(40).keys());
  tab.shift();
  table.shift();
  const onSubmitAvatar = (e, i) => {
    setAvatars(e.target.name);
    setSelectCardIndex(i + 1);
  };

  const onSubmit = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));
      const response = await api({
        method: "put",
        url: "/users/me/",
        data: { avatar },
        headers: { Authorization: `Bearer ${token}` },
      });

      onChangeAvatar(response.data);
      onClick();
    } catch (error) {
      console.log("------------------------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div className="style_avatar">
      <div className="style">
        <div className="test">
          {profil.isAdmin === true
            ? table &&
              table.map((element, i) => {
                return (
                  <div className="avatar_card" key={i} onClick={(e) => onSubmitAvatar(e, i)}>
                    <Card selectCardIndex={selectCardIndex} number={element} />
                  </div>
                );
              })
            : tab &&
              tab.map((element, i) => {
                return (
                  <div className="avatar_card" key={i} onClick={(e) => onSubmitAvatar(e, i)}>
                    <Card selectCardIndex={selectCardIndex} number={element} />
                  </div>
                );
              })}
        </div>
      </div>

      <button onClick={onSubmit} className="new" type="button">
        Envoyer
      </button>
    </div>
  );
};
export default Avatar;
