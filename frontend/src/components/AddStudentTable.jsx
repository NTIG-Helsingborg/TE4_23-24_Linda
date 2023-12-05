import { useEffect, useState, useRef } from "react";

const AddStudentTable = ({ setTriggerReload }) => {
  const [studentsNames, setStudentsNames] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [studentsNames]);

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
    <div id="add-students-child">
      <textarea
        ref={textareaRef}
        value={studentsNames}
        onChange={(e) => setStudentsNames(e.target.value)}
        style={{
          width: "fit-content",
          resize: "vertical",
          overflow: "auto",
        }}
      />
      <button onClick={handleSubmit}>ADD</button>
    </div>
  );
};

export default AddStudentTable;
