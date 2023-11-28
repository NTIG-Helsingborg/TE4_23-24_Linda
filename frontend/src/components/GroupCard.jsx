import react from "../assets/NtiPush.jpg";

const GroupCard = ({ groupStudents, groupName }) => {

  return (
    <>
      <div id="card">
        <p id="title">Group {groupName}</p>
        <div className="group">
          {groupStudents.map((e, Index) => (
            <div className={`student`} key={Index}>
              <img src={react} alt={""} className="img" />
              <div className="name">{e}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupCard;
