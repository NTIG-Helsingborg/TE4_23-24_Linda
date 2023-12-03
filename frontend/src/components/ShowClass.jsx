import { useEffect, useState } from "react";

const ShowClass = () => {
  const [classData, setClassData] = useState([]);
  if (!localStorage.getItem("class")) localStorage.setItem("class", "1TEK1");

  useEffect(() => {
    // Fetch class data from the backend when the component mounts
    fetch("http://localhost:3000/getClassInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setClassData(data.result))
      .catch((error) => console.error("Error fetching class data:", error));
  }, []);

  const handleRemoveStudent = (studentId) => {
    fetch("http://localhost:3000/removeStudentFromClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        className: localStorage.getItem("class").toUpperCase(),
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => {
        setClassData(classData.filter((student) => student.id !== studentId));
      })
      .catch((error) => console.error("Error removing student:", error));
  };

  return (
    <>
      <div id="background"></div>
      <div id="main">
        <button
          id="backButton"
          onClick={() => {
            localStorage.setItem("indexView", 0);
            location.reload();
          }}
        >
          Back
        </button>

        <div id="table-container">
          <table>
            <thead>
              <tr>
                <th>Remove</th>
                <th style={{ width: "25%" }}>Image</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((student) => (
                <tr key={student.id}>
                  <td>
                    <button onClick={() => handleRemoveStudent(student.id)}>
                      -
                    </button>
                  </td>
                  <td style={{ textAlign: "center", height: "80px" }}>
                    <img
                      src={`http://localhost:3000${student.image_filepath}`}
                      alt={`Profile of ${student.name}`}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </td>
                  <td>{student.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ShowClass;
