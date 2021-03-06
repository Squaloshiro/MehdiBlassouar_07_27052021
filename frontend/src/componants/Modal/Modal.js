import { useRef, useEffect } from "react";

import "./modal.scss";

const Modal = ({ close, children, onClick, setActive, active, popUpIsOpen, activeHide }) => {
  const clickOutSide = useRef();

  const handleClickOutside = (e) => {
    if (!clickOutSide.current.contains(e.target)) {
      if (!popUpIsOpen) {
        if (onClick) {
          setActive(false);
          onClick();
        } else {
          setActive(false);
        }
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const closeModal = () => {
    onClick();
    //close();
    setActive(false);
  };

  return (
    <div className="picturs">
      {active && (
        <div className="modal-componant" id="modal-componant">
          <div className={`${activeHide ? "last-content-comment-update" : "last-content"}`} ref={clickOutSide}>
            <div className={`${activeHide ? "hide-comment-update" : "hide"}   `} onClick={closeModal}>
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
