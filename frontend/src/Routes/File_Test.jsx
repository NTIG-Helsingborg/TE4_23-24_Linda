import { useState } from "react";

const File_Test = () => {
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <div id="background"></div>
      <div id="main">
        <input type="file" onChange={handleChange} />
        <img src={file} />
      </div>
    </>
  );
};

export default File_Test;
