/* eslint-disable react/jsx-key */
import GroupCard from "./GroupCard";
import { useState, useEffect } from "react";

const GroupDisplay = ({changeSelect}) => {
  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/getGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Update with the class ID you want to retrieve
        className: changeSelect.toUpperCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const dbClass = JSON.parse(json);
        setGroupData(dbClass.result);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error during fetch:", error));
  }, [changeSelect]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Change this value to change the amount of groups there are in a class
  const groupCount = 6;
  var groupRows = 2;
  var groupAmount = 2;
  if (groupCount < 3) {
    groupRows = 2;
    groupAmount = 3;
  } else if (groupCount > 6) {
    groupRows = 4;
    groupAmount = 7;
  } else {
    groupRows = 3;
    groupAmount = 3;
  }

  return (
    <>
      <div id="classDisplay">
        <div
          id="groupDisplay"
          style={{ gridTemplateColumns: `repeat(${groupRows}, 1fr)` }}
        >
          {groupData.map((group, index) => {
            return (
              <div id={`group${groupAmount}`} key={index}>
                <GroupCard
                  key={group.groupId}
                  groupName={group.groupName}
                  groupStudents={group.students}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GroupDisplay;
