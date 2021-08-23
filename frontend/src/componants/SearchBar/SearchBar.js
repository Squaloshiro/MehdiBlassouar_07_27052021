import { useState, useRef, useEffect } from "react";
import api from "../../config/api";
import { toastTrigger } from "../../helper/toast";
import { useHistory } from "react-router-dom";
import "./searchbar.scss";

const SearchBar = ({ myUserId }) => {
  const [active, setActive] = useState(false);
  const history = useHistory();
  const clickOutSide = useRef();
  const [valueSearchBar, setValueSearchBar] = useState("");
  const [dataUser, setDataUser] = useState([]);

  const redirectToUserProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
      setActive(false);
    } else {
      history.push({ pathname: "/users/profils", state: { id } });
      setActive(false);
    }
  };

  const handleClickOutside = (e) => {
    if (!clickOutSide.current?.contains(e.target)) {
      setActive(false);
      setValueSearchBar("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleChange = (e) => {
    setValueSearchBar(e.target.value);
  };

  const onClickSearchBar = (e) => {
    setActive(true);
  };

  const closeModal = () => {
    setActive(false);
    setValueSearchBar("");
  };

  useEffect(() => {
    const onClickSearchBar = async () => {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

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
    };
    onClickSearchBar();
  }, []);

  return (
    <div className="search_flex">
      <div className="Search">
        <input
          value={valueSearchBar}
          onClick={onClickSearchBar}
          onChange={handleChange}
          type="text"
          name="SearchBar"
          id="SearchBar"
          placeholder="Recherche un utilisateur"
        />
      </div>
      {active && (
        <div ref={clickOutSide} className="search_results">
          <div className="search_close" onClick={closeModal}>
            ✕
          </div>
          <div className="search_result">
            {dataUser &&
              dataUser
                .filter((element) => {
                  return element.username.toLowerCase().includes(valueSearchBar.toLowerCase());
                })
                .map((element) => {
                  return (
                    <div className="search_card" key={element.id}>
                      <div className="search_avatar_flex">
                        <img className="search_avatar" alt="img" src={element.avatar} />
                      </div>
                      <div className="search_charactere">
                        <div onClick={() => redirectToUserProfil(element.id)}>{element.username}</div>
                        <div>{element.email}</div>
                        {element.isAdmin === true ? <div>Administrateur</div> : <></>}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchBar;
