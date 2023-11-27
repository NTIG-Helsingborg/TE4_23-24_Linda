import React, { useState } from "react";

import reactLogo from "../assets/react.svg";
import Header from "../components/Header.jsx";

const Index = () => {
  /* START SIDA */
  return (
    <>
        <Header />
      <div id="main">
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
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
};

export default Index;
