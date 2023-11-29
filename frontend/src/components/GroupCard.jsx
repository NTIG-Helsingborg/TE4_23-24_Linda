import react from "../assets/NtiPush.jpg";

const GroupCard = ({ groupStudents, groupName }) => {
    return (
        <>
            <div id="card">
                <p id="title">Group {groupName}</p>
                <div className="group">
                    {groupStudents.map((e, Index) => (
                        <div className={`student`} key={Index}>
                            <img
                                src={e.image_filepath}
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
