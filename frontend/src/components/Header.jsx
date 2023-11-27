import React, { useState } from "react";
import menuIcon from "../assets/menu.svg";
import ClassSelect from "./ClassSelect.jsx";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div id="header">
        <div id="leftHeader">
          <button onClick={() => setToggle(!toggle)}>
            <img src={menuIcon} alt="Menu" />
          </button>
        </div>
        <div id="rightHeader">
          <h3>Edit Class</h3>
          <h3>Randomize Group</h3>
        </div>
      </div>
      {toggle && <ClassSelect />}
    </>
  );
};
export default Header;
