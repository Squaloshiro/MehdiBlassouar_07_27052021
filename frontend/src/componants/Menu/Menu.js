import { useState } from "react";

import "./menu.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRef, useEffect } from "react";

import Button from "../Button/Button";
const Menu = ({ element, messageId, openModalDestroy, deleteOneMessage, openModal, active }) => {
  const [menuActive, setMenuActive] = useState(false);

  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      if (menuActive) {
        setMenuActive(false);
      }
    }
  };

  const openMenu = () => {
    setMenuActive(true);
  };

  useEffect(() => {
    if (active) {
      setMenuActive(false);
    }
  }, [active]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="position-menu" ref={myRef}>
      <div onClick={openMenu} className="flex-menu">
        <FontAwesomeIcon color="gray" icon={["fas", "ellipsis-v"]} />
      </div>
      {menuActive && (
        <div className="new-content">
          <Button title="Modifier" onClick={(e) => openModal(element)} />
          <Button title="Supprimer" onClick={(e) => openModalDestroy(messageId)} />
        </div>
      )}
    </div>
  );
};

export default Menu;
