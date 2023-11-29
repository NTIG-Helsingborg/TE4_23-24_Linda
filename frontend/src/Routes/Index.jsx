import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay.jsx";
import ShowClass from "../components/ShowClass.jsx";
import { useState } from "react";

const Index = () => {
  const [changeSelect, setChangeSelect] = useState("1Dem1");
  return (
    <>
      <div id="background"></div>
      <Header setChangeSelect={setChangeSelect} />
      <div id="main">
        {localStorage.getItem("indexView") == 0 && <GroupDisplay changeSelect={changeSelect}/>}
        {localStorage.getItem("indexView") == 1 && <ShowClass />}
      </div>
    </>
  );
};

export default Index;
