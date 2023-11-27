import React, { useState } from "react";

import reactLogo from "../assets/react.svg";
import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay";

const Index = () => {
  /* START SIDA */
  return (
    <>
      <Header />
      <div id="main">
        <GroupDisplay />
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
};

export default Index;
