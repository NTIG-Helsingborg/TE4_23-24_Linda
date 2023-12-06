import { useState, useEffect } from "react";
import TempImg from "../assets/NTIPush.jpg";

const File_Test = ({ StudentID, image_filepath, setTriggerReload }) => {
  const [file, setFile] = useState();
  const [studentId, setStudentId] = useState(""); // Add state for studentId
  const [loading, setIsLoading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const handleFileChange = async (e) => {
    setIsLoading(true); // Set isLoading to true when a file is selected
    const selectedFile = e.target.files[0];
    setFile(URL.createObjectURL(selectedFile));

    // Send the file to the server
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("studentId", StudentID);
    try {
      const response = await fetch("http://localhost:3000/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Image uploaded successfully!");

        setTriggerReload(true); // Trigger a reload
        setCacheBuster(Date.now()); // Update the cacheBuster state
      } else console.error("Failed to upload image");
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setIsLoading(false); // Set isLoading to false after the file is handled
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div id="main">
        <label htmlFor="fileInput">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <img
            src={`http://localhost:3000${image_filepath}?${cacheBuster}`}
            /* alt={`Profile of ${student.name}`} */
            onError={(event) => {
              event.target.src = TempImg;
            }}
            alt="Preview"
            width={100}
            height={100}
          />
        </label>
      </div>
    </>
  );
};

export default File_Test;
