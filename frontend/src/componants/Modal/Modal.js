import { useRef, useEffect, useState } from "react";

import MessageUpdate from "../MessageUpdat/MessageUpdate";
import "./modal.scss";

const Modal = ({ viewUpdateMessage, messageId, element, openPopUp, setActive, active, onClick,messagesUser,setMessagesUser,myUserId }) => {
  const [popUpIsOpen, setPopUpIsOpen] = useState(false);
  const clickOutSide = useRef();

  const handleClickOutside = (e) => {
    if (!clickOutSide.current.contains(e.target)) {
      if (!popUpIsOpen) {
        setActive(false);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const closeModal = () => {
    setActive(false);
  };

  return (
    <div className="picturs">
      {active && (
        <div className="modal-componant" id="modal-componant">
          <div className="last-content" ref={clickOutSide}>
            <div className="hide" onClick={closeModal}>
              ✕
            </div>
            <div className="styl">
              <MessageUpdate
              setMessagesUser={setMessagesUser}
                setActive={setActive}
                messagesUser={messagesUser}
                viewUpdateMessage={viewUpdateMessage}
                element={element}
                setPopUpIsOpen={setPopUpIsOpen}
                openPopUp={openPopUp}
                onClick={onClick}
                myUserId={myUserId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
