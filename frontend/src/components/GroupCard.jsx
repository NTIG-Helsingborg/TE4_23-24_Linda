import react from "../assets/NtiPush.jpg";

const GroupCard = ({ groupCount, groupAmount}) => {


    const groups = [
        { group: 1 },
        { group: 2 },
        { group: 3 },
        { group: 4 },
        { group: 5 },
        { group: 6 },
    ];

    const students = [
        { name: "John Henric", image: "image1.jpg" },
        { name: "Stina Fishing", image: "image2.jpg" },
        { name: "Marko Urpers", image: "image3.jpg" },
        { name: "Bob Bobbington The third", image: "image4.jpg" },
    ];
    return (
        <>
            {groups.slice(0, groupCount).map((group, index) => (
                <div id={`group${groupAmount}`} key={index}>
                    <div id="card">
                        <p id="title">Group {group.group}</p>
                        <div className="group">
                            {students.map((student, studentIndex) => (
                                <div className={`student`} key={studentIndex}>
                                    <img src={react} alt={""} className="img" />
                                    <div className="name">{student.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default GroupCard;
