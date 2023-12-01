import React, { useState } from "react";

const RandomizeGroups = () => {
  const handleNewGroups = () => {
    fetch("/randomize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
        groupCount: 6,
        createGroupNames: true,
        addGroupLeader: true,
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
        console.log("urmom")
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
      .then((json) => console.log(json))
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
        location.reload();
      })
      .catch((error) => console.error("Error during fetch:", error));
  };

  const [toggleGroupLeader, setToggleGroupLeader] = useState(false);
  const [toggleGroupNames, setToggleGroupNames] = useState(false);
  const [groupCount, setGroupCount] = useState(2);

  const handleToggleGroupLeader = () => {
    setToggleGroupLeader(!toggleGroupLeader);
  };

  const handleToggleGroupNames = () => {
    setToggleGroupNames(!toggleGroupNames);
  };

  const handleGroupCountChange = (e) => {
    setGroupCount(parseInt(e.target.value));
  };


  return (
    <>
      <div id="randomizeGroups">
        <div id="randomButton">
          <p onClick={handleNewGroups}>RandomizeGroups</p>
        </div>
        <div id="randomizeToggles">
          <p>GroupLeader</p>
          <input
            type="checkbox"
            checked={toggleGroupLeader}
            onChange={handleToggleGroupLeader}
          />

          <p>GroupNames</p>
          <input
            type="checkbox"
            checked={toggleGroupNames}
            onChange={handleToggleGroupNames}
          />
        </div>
        <div id="randomizeText">
          <div id="grided">
            <p>Group Count</p>
            <p>Student Count</p>
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
      </div>
    </>
  );
};

export default RandomizeGroups;
