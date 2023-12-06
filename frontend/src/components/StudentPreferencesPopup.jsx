import { useState, useEffect } from "react";

const StudentPreferencesPopup = ({ currentStudent, setShowPref }) => {
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
          setStudents(studentsData.result);

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
  console.log(students);

  const handleToggleMustSitWith = (studentId) => {
    setMustSitWith((prevList) =>
      prevList.includes(studentId)
        ? prevList.filter((id) => id !== studentId)
        : [...prevList, studentId]
    );
  };

  const handleToggleCannotSitWith = (studentId) => {
    setCannotSitWith((prevList) =>
      prevList.includes(studentId)
        ? prevList.filter((id) => id !== studentId)
        : [...prevList, studentId]
    );
  };

  const handleSavePreferences = async () => {
    try {
      // Save the mustSitWith and cannotSitWith preferences to the server
      await fetch("http://localhost:3000/setStudentPreference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentID: currentStudent,
          preferenceArray: {
            mustSitWith: JSON.stringify(mustSitWith),
            cannotSitWith: JSON.stringify(cannotSitWith),
          },
        }),
      });

      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };
  let studentName = students.find(
    (student) => student.id === currentStudent
  )?.name;

  return (
    <div id="changePrefContainer">
      <button onClick={() => setShowPref(false)}> BACK</button>
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
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={mustSitWith.includes(student.id)}
                      onChange={() => handleToggleMustSitWith(student.id)}
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={cannotSitWith.includes(student.id)}
                      onChange={() => handleToggleCannotSitWith(student.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleSavePreferences}>Save Preferences</button>
      </div>
    </div>
  );
};

export default StudentPreferencesPopup;
