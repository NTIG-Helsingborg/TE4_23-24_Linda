import react from "../assets/NtiPush.jpg";

const GroupCard = ({ groupStudents, groupName }) => {
  return (
    <>
      <div className="card">
        <p id="title">{groupName}</p>
        <div className="group">
          {groupStudents.map((e, Index) => (
            <div
              className={`student`}
              key={Index}
              id={e.role === "GroupLeader" ? "groupleader" : ""}
            >
              <img
                src={`http://localhost:3000${e.image_filepath}`}
                alt={""}
                className="img"
                onError={(event) => {
                  event.target.src = react;
                }}
              />
              <div className="name">{e.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupCard;
