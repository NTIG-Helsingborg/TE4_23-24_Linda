import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay.jsx";
import ShowClass from "../components/ShowClass.jsx";
import AddStudentTable from "../components/AddStudentTable.jsx";
import { useEffect, useState } from "react";

const Index = () => {
  const [triggerReload, setTriggerReload] = useState(false);

  const [indexView, setIndexView] = useState(0);
  const [shouldReload, setShouldReload] = useState(false);
  /*
  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
      setShouldReload(false);
    }
  }, [shouldReload]);*/
  useEffect(() => {
    if (triggerReload) {
      setTriggerReload(false);
    }
  }, [triggerReload]);
  const handleViewChange = (newIndexView) => {
    setIndexView(newIndexView);
    //setShouldReload(true);
    setTriggerReload(true);
  };
  console.log("INDEX VIEW: " + indexView);
  return (
    <>
      <div id="background"></div>
      <Header
        setTriggerReload={setTriggerReload}
        setIndexView={handleViewChange}
      />
      <div id="main">
        {indexView == 0 && (
          <GroupDisplay
            triggerReload={triggerReload}
            setTriggerReload={setTriggerReload} // Pass setTriggerReload as a prop
            setIndexView={handleViewChange}
          />
        )}
        {indexView == 1 && (
          <ShowClass
            setIndexView={handleViewChange}
            setTriggerReload={setTriggerReload}
          />
        )}
        {indexView == 1 && (
          <div id="add-student-form">
            <h1> Add Students</h1>
            <AddStudentTable setTriggerReload={setTriggerReload} />
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
