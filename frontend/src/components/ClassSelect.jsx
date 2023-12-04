import { useState, useEffect } from "react";

const ClassSelect = (setupdGroup) => {
  // Checks if the selected class is the same as the one in localstorage and if it is it will set the state to true
  useEffect(() => {
    const selectedClass = localStorage.getItem("class").substring(1);
    if (selectedClass) {
      if (selectedClass.startsWith("Dem")) {
        setToggleDem(true);
      } else if (selectedClass.startsWith("Tek")) {
        setToggleTek(true);
      } else if (selectedClass.startsWith("It")) {
        setToggleIt(true);
      } else if (selectedClass.startsWith("Nat")) {
        setToggleNat(true);
      }
    }
  }, [localStorage.getItem("class")]);

  const [toggleDem, setToggleDem] = useState(false);
  const [toggleTek, setToggleTek] = useState(false);
  const [toggleIt, setToggleIt] = useState(false);
  const [toggleNat, setToggleNat] = useState(false);

  // Selected class will be toggled and the rest will be closed if the same class i selected while openin it will close
  //First it checks what handletoggle you selected by checking its id.
  //Then it will set the state of the selected class to true and the rest to false manualy
  //It then checks if the prev state is the same as the current state and if it is it will toggle the state
  const handleToggle = (classType) => {
    // This is run when the component is first rendered
    // Discard changes when the page is loaded
    fetch("/discardChanges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className: localStorage.getItem("class").toUpperCase(),
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
        console.log("Discard");
        setTriggerReload((prevState) => !prevState);
      })
      .catch((error) => console.error("Error during fetch:", error));
    if (classType === "Dem") {
      setToggleDem((prevState) => !prevState);
      setToggleTek(false);
      setToggleIt(false);
      setToggleNat(false);
    } else if (classType === "Tek") {
      setToggleDem(false);
      setToggleTek((prevState) => !prevState);
      setToggleIt(false);
      setToggleNat(false);
    } else if (classType === "It") {
      setToggleDem(false);
      setToggleTek(false);
      setToggleIt((prevState) => !prevState);
      setToggleNat(false);
    } else if (classType === "Nat-Tek") {
      setToggleDem(false);
      setToggleTek(false);
      setToggleIt(false);
      setToggleNat((prevState) => !prevState);
    }
  };

  const handleSelectChange = (value) => {
    // Press class select
    localStorage.setItem("class", value.toString());
    localStorage.setItem("indexView", 0);
    location.reload();
  };

  return (
    <>
      {console.log(localStorage.getItem("class"))}
      <div id="classSelect">
        <h1>Class Select</h1>
        <ul>
          <hr />
          <li onClick={() => handleToggle("Tek")} className="bold">
            Tek
          </li>
          {toggleTek && (
            <>
              <li
                onClick={() => handleSelectChange("1Tek1")}
                id={localStorage.getItem("class") === "1Tek1" ? "selected" : ""}
              >
                1Tek1
              </li>
              <li
                onClick={() => handleSelectChange("1Tek2")}
                id={localStorage.getItem("class") === "1Tek2" ? "selected" : ""}
              >
                1Tek2
              </li>
              <li
                onClick={() => handleSelectChange("2Tek1")}
                id={localStorage.getItem("class") === "2Tek1" ? "selected" : ""}
              >
                2Tek1
              </li>
              <li
                onClick={() => handleSelectChange("2Tek2")}
                id={localStorage.getItem("class") === "2Tek2" ? "selected" : ""}
              >
                2Tek2
              </li>
              <li
                onClick={() => handleSelectChange("3Tek1")}
                id={localStorage.getItem("class") === "3Tek1" ? "selected" : ""}
              >
                3Tek1
              </li>
              <li
                onClick={() => handleSelectChange("3Tek2")}
                id={localStorage.getItem("class") === "3Tek2" ? "selected" : ""}
              >
                3Tek2
              </li>
            </>
          )}
          <hr />
          <li onClick={() => handleToggle("It")} className="bold">
            It
          </li>
          {toggleIt && (
            <>
              <li
                onClick={() => handleSelectChange("1It1")}
                id={localStorage.getItem("class") === "1It1" ? "selected" : ""}
              >
                1It1
              </li>
              <li
                onClick={() => handleSelectChange("1It2")}
                id={localStorage.getItem("class") === "1It2" ? "selected" : ""}
              >
                1It2
              </li>
              <li
                onClick={() => handleSelectChange("2It1")}
                id={localStorage.getItem("class") === "2It1" ? "selected" : ""}
              >
                2It1
              </li>
              <li
                onClick={() => handleSelectChange("2It2")}
                id={localStorage.getItem("class") === "2It2" ? "selected" : ""}
              >
                2It2
              </li>
              <li
                onClick={() => handleSelectChange("3It1")}
                id={localStorage.getItem("class") === "3It1" ? "selected" : ""}
              >
                3It1
              </li>
              <li
                onClick={() => handleSelectChange("3It2")}
                id={localStorage.getItem("class") === "3It2" ? "selected" : ""}
              >
                3It2
              </li>
            </>
          )}
          <hr />
          <li onClick={() => handleToggle("Dem")} className="bold">
            Dem
          </li>
          {toggleDem && (
            <>
              <li
                onClick={() => handleSelectChange("1Dem1")}
                id={localStorage.getItem("class") === "1Dem1" ? "selected" : ""}
              >
                1Dem
              </li>
              <li
                onClick={() => handleSelectChange("2Dem1")}
                id={localStorage.getItem("class") === "2Dem1" ? "selected" : ""}
              >
                2Dem
              </li>
              <li
                onClick={() => handleSelectChange("3Dem1")}
                id={localStorage.getItem("class") === "3Dem1" ? "selected" : ""}
              >
                3Dem
              </li>
            </>
          )}
          <hr />
          <li onClick={() => handleToggle("Nat-Tek")} className="bold">
            Nat-Tek
          </li>
          {toggleNat && (
            <>
              <li
                onClick={() => handleSelectChange("1Nat1")}
                id={localStorage.getItem("class") === "1Nat1" ? "selected" : ""}
              >
                1Nat
              </li>
              <li
                onClick={() => handleSelectChange("2Nat1")}
                id={localStorage.getItem("class") === "2Nat1" ? "selected" : ""}
              >
                2Nat
              </li>
              <li
                onClick={() => handleSelectChange("3Nat1")}
                id={localStorage.getItem("class") === "3Nat1" ? "selected" : ""}
              >
                3Nat
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default ClassSelect;
