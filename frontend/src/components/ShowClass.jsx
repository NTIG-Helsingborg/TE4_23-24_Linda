import React, { useEffect, useState } from "react";

const ShowClass = () => {
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/getClassInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class"),
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
        {/* Render the class list as a table */}
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {classData.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000${student.image_filepath}`}
                    alt={`Profile of ${student.name}`}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ShowClass;
