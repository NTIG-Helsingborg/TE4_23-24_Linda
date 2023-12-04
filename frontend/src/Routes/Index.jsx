import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay.jsx";
import ShowClass from "../components/ShowClass.jsx";
import { useEffect, useState } from "react";

const Index = () => {
  const [triggerReload, setTriggerReload] = useState(false);

  const [indexView, setindexView] = useState(false);
  useEffect(() => {
    setindexView(localStorage.getItem("indexView"));
  }, []);

  if (!localStorage.getItem("indexView")) localStorage.setItem("indexView", 0);
  return (
    <>
      <div id="background"></div>
      <Header setTriggerReload={setTriggerReload} />
      <div id="main">
        {indexView == 0 && <GroupDisplay triggerReload={triggerReload} />}
        {indexView == 1 && <ShowClass />}
      </div>
    </>
  );
};

export default Index;
