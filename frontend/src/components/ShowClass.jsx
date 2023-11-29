const ShowClass = () => {
  return (
    <>
      <div id="background"></div>
      <div id="main">
        <p>{localStorage.getItem("class").toUpperCase()}</p>
      </div>
    </>
  );
};

export default ShowClass;
