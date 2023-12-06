import { useState, useEffect } from "react";
import File_Test from "../Routes/File_Test";
const StudentPreferencesPopup = ({
  currentStudent,
  setShowPref,
  setTriggerReload,
}) => {
  const [students, setStudents] = useState([]);
  const [mustSitWith, setMustSitWith] = useState([]);
  const [cannotSitWith, setCannotSitWith] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const className = localStorage.getItem("class").toUpperCase();

      fetch("http://localhost:3000/getClassStudents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          className: className,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((studentsData) => {
          const sortedStudents = studentsData.result.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setStudents(sortedStudents);

          // Fetch mustSitWith and cannotSitWith data for the current student
          return fetch("http://localhost:3000/getStudentPreference", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentID: currentStudent }),
          });
        })
        .then((preferencesResponse) => {
          if (!preferencesResponse.ok) {
            throw new Error(
              `HTTP error! Status: ${preferencesResponse.status}`
            );
          }
          return preferencesResponse.json();
        })
        .then((preferencesData) => {
          const { mustSitWith, cannotSitWith } = preferencesData.result || {};

          setMustSitWith(mustSitWith || []);
          setCannotSitWith(cannotSitWith || []);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchData();
  }, [currentStudent]);

  const handleToggleMustSitWith = (studentId) => {
    setMustSitWith((prevList) =>
      prevList.includes(studentId)
        ? prevList.filter((id) => id !== studentId)
        : [...prevList, studentId]
    );
    // If the student is in the cannotSitWith list, remove them
    setCannotSitWith((prevList) => prevList.filter((id) => id !== studentId));
  };

  const handleToggleCannotSitWith = (studentId) => {
    setCannotSitWith((prevList) =>
      prevList.includes(studentId)
        ? prevList.filter((id) => id !== studentId)
        : [...prevList, studentId]
    );
    // If the student is in the mustSitWith list, remove them
    setMustSitWith((prevList) => prevList.filter((id) => id !== studentId));
  };

  const handleSavePreferences = async () => {
    try {
      // Convert mustSitWith and cannotSitWith arrays to pure arrays []
      const pureMustSitWith = mustSitWith.filter((id) => id !== "");
      const pureCannotSitWith = cannotSitWith.filter((id) => id !== "");

      // Save the mustSitWith and cannotSitWith preferences to the server
      await fetch("http://localhost:3000/setStudentPreference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentID: currentStudent,
          preferenceArray: {
            mustSitWith: pureMustSitWith,
            cannotSitWith: pureCannotSitWith,
          },
        }),
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };
  //Remove the current student from the list of students
  let filteredStudents = students.filter(
    (student) => student.id !== currentStudent
  );
  let studentName = students.find(
    (student) => student.id === currentStudent
  )?.name;
  let studentImage = students.find(
    (student) => student.id === currentStudent
  )?.image_filepath;

  return (
    <div id="changePrefContainer">
      <button id="back" onClick={() => setShowPref(false)}>
        {" "}
        BACK
      </button>
      <div id="img">
        <File_Test
          StudentID={currentStudent}
          image_filepath={studentImage}
          setTriggerReload={setTriggerReload}
        />
      </div>
      <h2>Student Preferences for {studentName}</h2>
      <div>
        <h3>Students from the Same Class:</h3>
        <div id="changePrefContent">
          <table>
            <thead>
              <tr>
                <th>Must Sit With</th>
                <th>Student Name</th>
                <th>Cannot Sit With</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={mustSitWith.includes(student.id)}
                      onChange={() => handleToggleMustSitWith(student.id)}
                      style={{width: "20px", height: "20px",}}
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={cannotSitWith.includes(student.id)}
                      onChange={() => handleToggleCannotSitWith(student.id)}
                      style={{width: "20px", height: "20px",}}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button id="save" onClick={handleSavePreferences}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default StudentPreferencesPopup;
