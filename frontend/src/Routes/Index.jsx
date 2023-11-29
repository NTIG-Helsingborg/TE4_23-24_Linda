import Header from "../components/Header.jsx";
import GroupDisplay from "../components/GroupDisplay.jsx";
import ShowClass from "../components/ShowClass.jsx";

const Index = () => {
  return (
    <>
      <div id="background"></div>
      <Header />
      <div id="main">
        {localStorage.getItem("indexView") == 0 && <GroupDisplay />}
        {localStorage.getItem("indexView") == 1 && <ShowClass />}
      </div>
    </>
  );
};

export default Index;
