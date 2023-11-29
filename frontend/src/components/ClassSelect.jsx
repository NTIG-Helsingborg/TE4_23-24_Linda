import React, { useState } from "react";
const ClassSelect = () => {
    const [toggleDem, setToggleDem] = useState(false);
    const [toggleTek, setToggleTek] = useState(false);
    const [toggleIt, setToggleIt] = useState(false);
    const [toggleNat, setToggleNat] = useState(false);
    

    // Selected class will be toggled and the rest will be closed if the same class i selected while openin it will close
    //First it checks what handletoggle you selected by checking its id. 
    //Then it will set the state of the selected class to true and the rest to false manualy
    //It then checks if the prev state is the same as the current state and if it is it will toggle the state
    const handleToggle = (classType) => {
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
    
    const [changeSelect, setChangeSelect] = useState("1Dem1");

    const handleSelectChange = (value) => {
        setChangeSelect(value);
    };


    return (
        <>
            <div id="classSelect">
                <h1>Class Select</h1>
                <ul>
                    <hr />
                    <li onClick={() => handleToggle("Dem")} className="bold">
                        Dem
                    </li>
                    {toggleDem && (
                        <>
                            <li onClick={() => handleSelectChange("1Dem1")}>1Dem</li>
                            <li onClick={() => handleSelectChange("2Dem1")}>2Dem</li>
                            <li onClick={() => handleSelectChange("3Dem1")}>3Dem</li>
                        </>
                    )}
                    <hr />
                    <li onClick={() => handleToggle("Nat-Tek")} className="bold">
                        Nat-Tek
                    </li>
                    {toggleNat && (
                        <>
                            <li onClick={() => handleSelectChange("1Nat")}>1Nat</li>
                            <li onClick={() => handleSelectChange("2Nat")}>2Nat</li>
                            <li onClick={() => handleSelectChange("3Nat")}>3Nat</li>
                        </>
                    )}
                    <hr />
                    <li onClick={() => handleToggle("Tek")} className="bold">
                        Tek
                    </li>
                    {toggleTek && (
                        <>
                            <li onClick={() => handleSelectChange("1Tek1")}>1Tek1</li>
                            <li onClick={() => handleSelectChange("1Tek2")}>1Tek2</li>
                            <li onClick={() => handleSelectChange("2Tek1")}>2Tek1</li>
                            <li onClick={() => handleSelectChange("2Tek2")}>2Tek2</li>
                            <li onClick={() => handleSelectChange("3Tek1")}>3Tek1</li>
                            <li onClick={() => handleSelectChange("3Tek2")}>3Tek2</li>
                        </>
                    )}
                    <hr />
                    <li onClick={() => handleToggle("It")} className="bold">
                        It
                    </li>
                    {toggleIt && (
                        <>
                            <li onClick={() => handleSelectChange("1It1")}>1It1</li>
                            <li onClick={() => handleSelectChange("1It2")}>1It2</li>
                            <li onClick={() => handleSelectChange("2It1")}>2It1</li>
                            <li onClick={() => handleSelectChange("2It2")}>2It2</li>
                            <li onClick={() => handleSelectChange("3It1")}>3It1</li>
                            <li onClick={() => handleSelectChange("3It2")}>3It2</li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default ClassSelect;

