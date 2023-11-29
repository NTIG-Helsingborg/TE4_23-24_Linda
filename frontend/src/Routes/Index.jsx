import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay";
import { useState } from "react";

const Index = () => {
  const [changeSelect, setChangeSelect] = useState("1TEK1");
  /* START SIDA */
  return (
    <>
      <div id="background"></div>
      <Header setChangeSelect={setChangeSelect} />
      <div id="main">
        <GroupDisplay changeSelect={changeSelect} />
      </div>
    </>
  );
};

export default Index;
