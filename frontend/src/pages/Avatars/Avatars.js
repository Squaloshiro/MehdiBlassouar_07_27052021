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
      style={selectCardIndex === number ? { border: "1px solid black" } : null}
      name={images[`${number}.jpg`].default}
      src={images[`${number}.jpg`].default}
      alt={number}
      height={150}
      width={150}
    />
  );
};
const Avatar = ({ onChangeAvatar, close }) => {
  const [avatar, setAvatars] = useState("");

  const [selectCardIndex, setSelectCardIndex] = useState(null);
  const tab = Array.from(Array(40).keys());

  tab.shift();

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
      close();
    } catch (error) {
      console.log("------------------------------------");
      console.log(error);
      console.log("------------------------------------");
    }
  };

  return (
    <div>
      <div className="style">
        <div className="test">
          {tab &&
            tab.map((element, i) => {
              return (
                <div key={i} onClick={(e) => onSubmitAvatar(e, i)}>
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
