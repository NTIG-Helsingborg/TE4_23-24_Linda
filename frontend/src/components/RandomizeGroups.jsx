import React, { useState } from "react";

const RandomizeGroups = () => {
  const [toggleGroupLeader, setToggleGroupLeader] = useState(false);
  const [toggleGroupNames, setToggleGroupNames] = useState(false);
  const [groupCount, setGroupCount] = useState(2);
  const [studentCount, setStudentCount] = useState(2);

  const handleToggleGroupLeader = () => {
    setToggleGroupLeader(!toggleGroupLeader);
  };

  const handleToggleGroupNames = () => {
    setToggleGroupNames(!toggleGroupNames);
  };

  const handleGroupCountChange = (e) => {
    setGroupCount(parseInt(e.target.value));
  };

  const handleStudentCountChange = (e) => {
    setStudentCount(parseInt(e.target.value));
  };

  return (
    <>
      <div id="randomizeGroups">
        <div id="randomButton">
          <p>RandomizeGroups</p>
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
          <p className="button" id="save">
            Save
          </p>
          <p className="button" id="discard">
            Discard
          </p>
        </div>
      </div>
    </>
  );
};

export default RandomizeGroups;
