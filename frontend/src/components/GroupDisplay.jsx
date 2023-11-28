import GroupCard from "./GroupCard";
const GroupDisplay = () => {
  // Change this value to change the amount of groups there are in a class
    const groupCount = 18;

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
        <div className="card">
          <div
            id="groupDisplay"
            style={{ gridTemplateColumns: `repeat(${groupRows}, 1fr)` }}
          >
            <GroupCard groupCount={groupCount} groupAmount={groupAmount}/>
          </div>
        </div>
      </div>
    </>
  );
};
export default GroupDisplay;
