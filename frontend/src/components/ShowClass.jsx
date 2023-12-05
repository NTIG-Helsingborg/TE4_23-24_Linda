import { useEffect, useState } from "react";
import StudentPreferencesPopup from "./StudentPreferencesPopup";

const AddStudentTable = () => {
  const [studentsNames, setStudentsNames] = useState("");

  const handleSubmit = () => {
    fetch("/addStudentToClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
        studentsNames,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => console.log(json))
      .then(() => {
        location.reload();
      })
      .catch((error) => console.error("Error during fetch:", error));
  };

  return (
    <div>
      <textarea
        value={studentsNames}
        onChange={(e) => setStudentsNames(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Students</button>
    </div>
  );
};

const ShowClass = () => {
  const [classData, setClassData] = useState([]);
  const [newStudentId, setNewStudentId] = useState(null);
  const [reloadAddStudentTable, setReloadAddStudentTable] = useState(false);
  if (!localStorage.getItem("class")) localStorage.setItem("class", "1TEK1");

  useEffect(() => {
    // Fetch class data from the backend when the component mounts or when a student is added
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
      .then((data) => {
        const sortedData = data.result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setClassData(sortedData);
      })
      .catch((error) => console.error("Error fetching class data:", error));
    fetchClassData();
  }, [newStudentId, reloadAddStudentTable]);

  const fetchClassData = () => {
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
      .then((data) => {
        const sortedData = data.result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setClassData(sortedData);
      })
      .catch((error) => console.error("Error fetching class data:", error));
  };

  const handleAddStudent = (studentId, studentName) => {
    fetch("http://localhost:3000/addStudentToClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
        studentId: studentId,
        studentName: studentName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.error("Student not found in the students table");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        setNewStudentId(studentId);
        setReloadAddStudentTable(true);
      })
      .catch((error) => console.error("Error adding student:", error));
    location.reload();
  };

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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setClassData(classData.filter((student) => student.id !== studentId));
        setReloadAddStudentTable((prev) => !prev); // Toggle the value
      })
      .catch((error) => console.error("Error removing student:", error));
    location.reload();
  };

  const [showPref, setShowPref] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null); // The student whose preferences are being edited
  const changePref = (studentID) => {
    setShowPref(true);
    setCurrentStudent(studentID);
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
                  <td>
                    <button
                      onClick={() => changePref(student.id)}
                      style={{
                        border: "none",
                        background: "none",
                        padding: "5px",
                      }}
                    >
                      {student.name}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="add-student-form">
          <h3> Add Students</h3>
          <AddStudentTable />
        </div>

        {showPref && (
          <StudentPreferencesPopup
            currentStudent={currentStudent}
            setShowPref={setShowPref}
          />
        )}
      </div>
    </>
  );
};

export default ShowClass;
