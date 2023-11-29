import NTILoga from "../assets/NTILoga.png";
import ClassSelect from "./ClassSelect.jsx";

const Header = () => {
  const handleNewGroups = () => {
    fetch("/randomize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: "1TEK1",
        groupCount: 6,
        createGroupNames: true,
        addGroupLeader: true,
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
        localStorage.setItem("indexView", 0);
        location.reload();
      })
      .catch((error) => console.error("Error during fetch:", error));
  };

  return (
    <>
      <div id="header">
        <img src={NTILoga} alt="NTI Logo" />
        <div id="TopHeader">
          <h3
            onClick={() => {
              localStorage.setItem("indexView", 1);
              location.reload();
            }}
          >
            Edit Class
          </h3>
          <h3 onClick={handleNewGroups}>New Groups</h3>
          <h3>Archives</h3>
        </div>
        <div id="BottomHeader">
          <ClassSelect />
        </div>
      </div>
    </>
  );
};
export default Header;
