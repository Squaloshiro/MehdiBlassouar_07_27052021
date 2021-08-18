import { useRef, useEffect } from "react";

import "./modal.scss";

const Modal = ({ children, setActive, active, popUpIsOpen }) => {
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
            <div className="styl">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
