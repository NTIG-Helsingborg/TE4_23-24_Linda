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
        className: localStorage.getItem("class").toUpperCase(), // Replace with the actual class name
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

  return (
    <>
      <div id="background"></div>
      <div id="main">
        <div id="table-container">
          {/* Render the class list as a table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Image</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((student) => (
                <tr key={student.id}>
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
