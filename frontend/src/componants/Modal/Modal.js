import { useState, useEffect } from "react";
import Button from "../Button/Button";
import Update from "../MessageUpdat/Update";
import "./modal.scss";

const Modal = ({ viewUpdateMessage, messageId, element, setPopUpIsOpen, openPopUp, setActive, active, onClick }) => {
  const closeModal = () => {
    setActive(false);
  };

  return (
    <div className="picturs">
      {active && (
        <div className="modal-componant" id="modal-componant">
          <div className="last-content">
            <div className="hide" onClick={closeModal}>
              ✕
            </div>
            <div className="styl">
              <Update
                setActive={setActive}
                viewUpdateMessage={viewUpdateMessage}
                element={element}
                setPopUpIsOpen={setPopUpIsOpen}
                openPopUp={openPopUp}
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
