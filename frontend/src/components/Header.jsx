import NTILoga from "../assets/NTILoga.png";
import ClassSelect from "./ClassSelect.jsx";
import RandomizeGroups from "./RandomizeGroups.jsx";
import { useState } from "react";

const Header = ({setTriggerReload}) => {
  const [showRandomizeGroups, setShowRandomizeGroups] = useState(false);

  const handleEditClassClick = () => {
    localStorage.setItem("indexView", 1);
    location.reload();
  };

  const handleNewGroupsClick = () => {
    setShowRandomizeGroups(!showRandomizeGroups); // Toggle the state
  };

  return (
    <>
      <div id="header">
        <img src={NTILoga} alt="NTI Logo" />
        <div id="TopHeader">
          <h3 onClick={handleEditClassClick}>Edit Class</h3>
          <h3 onClick={handleNewGroupsClick}>New Groups</h3>
          <h3>Archives</h3>
        </div>
        <div id="BottomHeader">
          <ClassSelect />
        </div>
        {showRandomizeGroups && <RandomizeGroups setTriggerReload={setTriggerReload}/>}
      </div>
    </>
  );
};
export default Header;
