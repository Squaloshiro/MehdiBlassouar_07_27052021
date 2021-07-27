import { useState } from "react";

import "./test.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomizedDialogs from "../MessageUpdat/MessageUpdat";
import MessageDestroy from "../DestroyMsg/DestroyMsg";
import { useRef, useEffect } from "react";
const Menu = ({ viewUpdateMessage, element, messageId, deleteOneMessage }) => {
  const [active, setActive] = useState(false);
  const userNameRef = useRef(null);

  const [clickedOutside, setClickedOutside] = useState(false);
  const myRef = useRef();
  console.log("----------------myRef--------------------");
  console.log(myRef);
  console.log("------------------------------------");

  const handleClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      setClickedOutside(true);
    }
  };

  const handleClickInside = () => setClickedOutside(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const openMenu = () => {
    setActive(true);
  };
  const closeMenu = (e) => {
    setActive(false);
  };
  const testMenu = () => {
    userNameRef.current.MouseEvent();
  };
  return (
    <div className="position-menu">
      <div ref={myRef} onClick={handleClickInside}>
        {clickedOutside ? (
          <div onClick={openMenu} className="flex-menu">
            <FontAwesomeIcon color="gray" icon={["fas", "ellipsis-v"]} />
          </div>
        ) : (
          <div>
            <div onClick={openMenu} className="flex-menu">
              <FontAwesomeIcon color="gray" icon={["fas", "ellipsis-v"]} />
            </div>
            {active && (
              <div className="new-content">
                <CustomizedDialogs viewUpdateMessage={viewUpdateMessage} element={element} />
                <MessageDestroy deleteOneMessage={deleteOneMessage} messageId={messageId} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
