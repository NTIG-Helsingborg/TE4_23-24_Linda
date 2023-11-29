import react from "../assets/NtiPush.jpg";

const GroupCard = ({ groupStudents, groupName }) => {
  return (
    <>
      <div id="card">
        <p id="title">Group {groupName}</p>
        <div className="group">
          {groupStudents.map((e, Index) => (
            <div className={`student`} key={Index}>
              {console.log(e.image_filepath)}
              <img
                src={`http://localhost:3000${e.image_filepath}`}
                alt={""}
                className="img"
                onError={(event) => {
                  event.target.src = react;
                }}
              />
              <div
                className="name"
                style={{ color: e.role === "GroupLeader" ? "red" : "inherit" }}
              >
                {e.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupCard;
