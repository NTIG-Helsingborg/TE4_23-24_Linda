import React from "react";
import { useState } from "react";

const RandomHelp = ({ setIsToggled, isToggled }) => {
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <>
      <div id="helpback" onClick={handleToggle}>
        {/* Backgroun */}
      </div>
      <div className="randomHelp">
        <div id="title">
          <h1>HELP!</h1>
        </div>
        <hr />
        <div id="content">
          <p>
            The <strong>SELECTED</strong> class is written at the top of the
            screen.
          </p>
          <strong>
            <p>Assign Leader</p>
          </strong>
          <p>
            This will randomly select a person in each group to be their leader.
          </p>
          <strong>
            <p>Group Names</p>
          </strong>
          <p>
            This will randomly give each group a name that can be associated
            with that group. If not selected the groups will be given a number
            instead
          </p>
          <strong>
            <p>Random Type</p>
          </strong>
          <p>
            You can create groups based on the amount of groups{" "}
            <strong>OR</strong> the amount of students per group. Your current
            selected option is highlighted in <strong>BLUE</strong>
          </p>
          <p>
            Changing the number in the dropdown will change the value of how
            many groups or how many students.
          </p>
          <strong>
            <p>Finished</p>
          </strong>
          <p>
            You can keep randomizing the groups and tweak the settings. When you
            have found one that you want press SAVE to apply the new groups.
          </p>
          <hr />
          <div id="alerts">
            <h1>OBS</h1>
            <p>
              DOING ANY OF THESE ACTIONS WILL REMOVE THE CURRENT UNSAVED GROUP:{" "}
              <br /> CLOSING THE TAB, SWITCHING TO EDIT CLASS, PRESSING DISCARD.
            </p>
            <p>
              SAVING WILL REMOVE THE OLD GROUP, MAKE SURE YOU ARE HAPPY WITH THE
              NEW GROUPS AS THERE IS NO WAY TO GET THE OLD ONES BACK
            </p>
            <h1>OBS</h1>
          </div>
          <p></p>
        </div>
      </div>
    </>
  );
};

export default RandomHelp;
