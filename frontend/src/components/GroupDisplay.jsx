/* eslint-disable react/jsx-key */
import GroupCard from "./GroupCard";
import { useState, useEffect } from "react";

const GroupDisplay = ({ triggerReload, setIndexView, setTriggerReload }) => {
  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (triggerReload) {
      setIndexView(0);
    }
    if (!localStorage.getItem("class")) localStorage.setItem("class", "1TEK1");
    fetch("/getGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Update with the class ID you want to retrieve
        className: localStorage.getItem("class").toUpperCase(),
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
        setGroupData(dbClass);
        setIsLoading(false);
        setTriggerReload(false); // Reset triggerReload after fetching the data

        //triggerReload(false); // Reset triggerReload after fetching the data
      })
      .catch((error) => console.error("Error during fetch:", error));
  }, [triggerReload, localStorage.getItem("class")]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(groupData);
  return (
    <>
      <div id="classDisplay">
        <div>
          <h1>{localStorage.getItem("class").toUpperCase()} </h1>
        </div>
        <div id="groupDisplay">
          {groupData.result.groups.map((group) => {
            return (
              <GroupCard
                key={group.groupId}
                groupName={group.groupName}
                groupStudents={group.students}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GroupDisplay;
