import { useState } from "react";

const File_Test = () => {
  const [file, setFile] = useState();
  const [studentId, setStudentId] = useState(""); // Add state for studentId

  const downloadImg = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(URL.createObjectURL(selectedFile));

    // Send the file to the server
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("studentId", studentId);
    try {
      const response = await fetch("http://localhost:3000/uploadImage", {
        method: "POST",
        body: formData,
      });
      if (response.ok) console.log("Image uploaded successfully!");
      else console.error("Failed to upload image");
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  return (
    <>
      <div id="background"></div>
      <div id="main">
        <input type="file" onChange={downloadImg} />
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={handleStudentIdChange}
        />
        <img src={file} alt="Preview" />
      </div>
    </>
  );
};

export default File_Test;
