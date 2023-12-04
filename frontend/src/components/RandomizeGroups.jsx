/* eslint-disable react/prop-types */
import { useState } from "react";
import RandomHelp from "./RandomHelp.jsx";

const RandomizeGroups = ({ setTriggerReload }) => {
  const [isSaved, setIsSaved] = useState(true);
  const [isToggled, setIsToggled] = useState(false);
  const [toggleSortType, setToggleSortType] = useState(true);

  const handleNewGroups = () => {
    fetch("/randomize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
        ...(toggleSortType
          ? { groupCount: groupCount }
          : { studentCount: groupCount }),

        //studentCount: groupCount,
        createGroupNames: toggleGroupNames,
        addGroupLeader: toggleGroupLeader,
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => {
        localStorage.setItem("indexView", 0);
        console.log("Random");
        setIsSaved(false);
        setTriggerReload((prevState) => !prevState);
      })
      .catch((error) => console.error("Error during fetch:", error));
  };

  const handleSaveGroups = () => {
    fetch("/saveGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        localStorage.setItem("indexView", 0);
        console.log("Saved");
        setIsSaved(true);
        setTriggerReload((prevState) => !prevState);
      })
      /* .then(() => {
        fetch("/archiveAdd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className: localStorage.getItem("class").toUpperCase(),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((json) => console.log(json))
          .catch((error) => console.error("Error during fetch:", error));
      }) */
      .catch((error) => console.error("Error during fetch:", error));
  };
  const handleDiscardGroups = () => {
    fetch("/discardChanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => console.log(json))
      .then(() => {
        localStorage.setItem("indexView", 0);
        console.log("Discard");
        setIsSaved(true);
        setTriggerReload((prevState) => !prevState);
      })
      .catch((error) => console.error("Error during fetch:", error));
  };

  const [toggleGroupLeader, setToggleGroupLeader] = useState(true);
  const [toggleGroupNames, setToggleGroupNames] = useState(true);
  const [groupCount, setGroupCount] = useState(6);

  const handleToggleGroupLeader = () => {
    setToggleGroupLeader(!toggleGroupLeader);
  };

  const handleToggleGroupNames = () => {
    setToggleGroupNames(!toggleGroupNames);
  };

  const handleToggleSortType = () => {
    setToggleSortType(!toggleSortType);
  };

  const handleGroupCountChange = (e) => {
    setGroupCount(parseInt(e.target.value));
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  console.log("urmom");
  return (
    <>
      <div id="randomizeGroups">
        {!isSaved && (
          <h1 style={{ marginTop: "50px", marginBottom: "20px" }}>
            NOT SAVED!
          </h1>
        )}
        <div
          onClick={handleNewGroups}
          id="randomButton"
          style={{ marginTop: isSaved ? "118px" : "0px" }}
        >
          <p>Randomize Groups</p>
        </div>
        <div id="randomizeToggles">
          <p>Assign Leaders</p>
          <input
            type="checkbox"
            checked={toggleGroupLeader}
            onChange={handleToggleGroupLeader}
          />

          <p>Group Names</p>
          <input
            type="checkbox"
            checked={toggleGroupNames}
            onChange={handleToggleGroupNames}
          />
        </div>
        <div id="randomizeText">
          <div id="grided">
            <p
              className="count"
              id={toggleSortType ? "selected" : ""}
              onClick={handleToggleSortType}
            >
              Group Count
            </p>
            <p
              className="count"
              id={toggleSortType ? "" : "selected"}
              onClick={handleToggleSortType}
            >
              Student Count
            </p>
          </div>
          <select value={groupCount} onChange={handleGroupCountChange} id="1">
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 2} value={i + 2}>
                {i + 2}
              </option>
            ))}
          </select>
        </div>
        <div id="randomizeSave">
          <p className="button" id="save" onClick={handleSaveGroups}>
            Save
          </p>
          <p className="button" id="discard" onClick={handleDiscardGroups}>
            Discard
          </p>
        </div>
        <div id="helpButton">
          <h2 onClick={handleToggle}>HELP</h2>
        </div>
      </div>
      {isToggled && (
        <RandomHelp setIsToggled={setIsToggled} isToggled={isToggled} />
      )}
    </>
  );
};

export default RandomizeGroups;
