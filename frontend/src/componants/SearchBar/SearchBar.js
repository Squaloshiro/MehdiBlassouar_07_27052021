import { useState, useRef, useEffect } from "react";

import { useHistory } from "react-router-dom";
import "./searchbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ myUserId, avatar, firstNewName, newEmail, lastNewName, dataUser }) => {
  const [active, setActive] = useState(false);
  const history = useHistory();
  const clickOutSide = useRef();
  const [valueSearchBar, setValueSearchBar] = useState("");

  const [classNameSearch, setClassNameSearch] = useState("search-icon");

  const useFocus = () => {
    const htmlRef = useRef(null);
    const setFocus = () => {
      htmlRef.current && htmlRef.current.focus();
    };
    return [htmlRef, setFocus];
  };
  const [inputRef, setInputRef] = useFocus();

  useEffect(() => {
    if (active) {
      setClassNameSearch("search-icon-after");
    } else {
      setClassNameSearch("search-icon");
    }
  }, [active]);

  const onClickSearch = () => {
    setInputRef();
    setActive(true);
  };
  const redirectToUserProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
      setActive(false);
    } else {
      history.push({ pathname: `/users/profils/${id}` });
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

  if (avatar) {
    dataUser.filter((elt) => {
      if (elt.id === myUserId) {
        elt.avatar = avatar;
      }
      return elt;
    });
  }
  if (firstNewName) {
    dataUser.filter((elt) => {
      if (elt.id === myUserId) {
        elt.firstName = firstNewName;
      }
      return elt;
    });
  }
  if (lastNewName) {
    dataUser.filter((elt) => {
      if (elt.id === myUserId) {
        elt.lastName = lastNewName;
      }
      return elt;
    });
  }
  if (newEmail) {
    dataUser.filter((elt) => {
      if (elt.id === myUserId) {
        elt.email = newEmail;
      }
      return elt;
    });
  }
  return (
    <div className="search_flex">
      <div className="search">
        <FontAwesomeIcon onClick={onClickSearch} className={classNameSearch} icon={["fas", "search"]} />
        <input
          ref={inputRef}
          className="search-input"
          value={valueSearchBar}
          label="Recherche"
          aria-label="Recherche"
          onClick={onClickSearchBar}
          onChange={handleChange}
          type="search"
          name="SearchBar"
          id="SearchBar"
          placeholder="Recherche un utilisateur..."
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
                  const searchLastnameFirstname = element.lastName + element.firstName;
                  return searchLastnameFirstname.toLowerCase().includes(valueSearchBar.toLowerCase());
                })
                .map((element) => {
                  const lastnameFirstname = element.lastName + " " + element.firstName;

                  return (
                    <div onClick={() => redirectToUserProfil(element.id)} className="search_card" key={element.id}>
                      <div className="search_avatar_flex">
                        <img className="search_avatar" alt="img" src={element.avatar} />
                      </div>
                      <div className="search_charactere">
                        <div>{lastnameFirstname}</div>
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
