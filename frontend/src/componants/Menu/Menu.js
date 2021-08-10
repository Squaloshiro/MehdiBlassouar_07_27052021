import { useState } from "react";

import "./test.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomizedDialogs from "../MessageUpdat/MessageUpdat";
import MessageDestroy from "../DestroyMsg/DestroyMsg";
import { useRef, useEffect } from "react";
import Modal from "../../componants/Modal/Modal";
import Button from "../Button/Button";
const Menu = ({ viewUpdateMessage, element, messageId, deleteOneMessage, openModal }) => {
  const [menuActive, setMenuActive] = useState(false);

  const [popUpIsOpen, setPopUpIsOpen] = useState(false);
  const myRef = useRef();

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      if (!popUpIsOpen) {
        setMenuActive(false);
      }
    }
  };

  const openMenu = () => {
    setMenuActive(true);
  };
  const closeMenu = (e) => {
    setMenuActive(false);
  };

  const openPopUp = () => {
    if (!popUpIsOpen) {
      setPopUpIsOpen(true);
    }
  };
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
          <MessageDestroy deleteOneMessage={deleteOneMessage} messageId={messageId} />
        </div>
      )}
    </div>
  );
};

export default Menu;
