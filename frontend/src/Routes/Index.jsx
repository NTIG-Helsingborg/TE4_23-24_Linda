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
      </div>
    </>
  );
};

export default Index;
