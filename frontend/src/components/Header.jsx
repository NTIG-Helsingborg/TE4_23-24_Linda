import React, { useState } from "react";
import NTILoga from "../assets/NTILoga.png";
import ClassSelect from "./ClassSelect.jsx";

const Header = () => {
  return (
    <>
      <div id="header">
      <img src={NTILoga}/>
        <div id="TopHeader">
          <h3>Edit Class</h3>
          <h3>New Groups</h3>
          <h3>Archives</h3>
        </div>
        <div id="BottomHeader">
          <ClassSelect />
        </div>
      </div>
    </>
  );
};
export default Header;
