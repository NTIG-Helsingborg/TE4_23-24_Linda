import React, { useState } from "react";

import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay";

const Index = () => {
  /* START SIDA */
  return (
    <>
      <div id="background"></div>
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
