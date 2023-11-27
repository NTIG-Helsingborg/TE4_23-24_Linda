import GroupCard from "./GroupCard";
const GroupDisplay = () => {
  const groupCount = 3;

  return (
    <>
      <div id="classDisplay">
        <div className="card">
          <div
            id="groupDisplay"
            style={{ gridTemplateColumns: `repeat(${groupCount}, 1fr)` }}
          >
            <GroupCard />
          </div>
        </div>
      </div>
    </>
  );
};
export default GroupDisplay;
