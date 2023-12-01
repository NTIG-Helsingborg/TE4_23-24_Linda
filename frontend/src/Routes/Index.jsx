import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay.jsx";
import ShowClass from "../components/ShowClass.jsx";
import { useState } from "react";

const Index = () => {
  const [triggerReload, setTriggerReload] = useState(false);
  
  if (!localStorage.getItem("indexView")) localStorage.setItem("indexView", 0);
  return (
    <>
      <div id="background"></div>
      <Header setTriggerReload={setTriggerReload} />
      <div id="main">
        {localStorage.getItem("indexView") == 0 && <GroupDisplay  triggerReload={triggerReload}/>}
        {localStorage.getItem("indexView") == 1 && <ShowClass />}
      </div>
    </>
  );
};

export default Index;
