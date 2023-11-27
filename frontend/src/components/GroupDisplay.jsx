const GroupDisplay = () => {
  return (
    <>
      <div id="classDisplay">
        <h1>Vite + React</h1>
        <div className="card">
          <button
            onClick={() =>
              fetch("/randomize", {
                method: "POST",
                body: JSON.stringify({}),
              })
                .then((response) => response.json())
                .then((json) => console.log(json))
            }
          ></button>
        </div>
       {/*  <div id="card">
            <div id="title">Title</div>
            <ul>
                <li>John</li>
                <li>John</li>
                <li>John</li>
                <li>John</li>
            </ul>
        </div> */}
      </div>
    </>
  );
};
export default GroupDisplay;
