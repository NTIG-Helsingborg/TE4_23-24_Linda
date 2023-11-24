import menuIcon from "../assets/menu.svg";

const Header = () => {
  return (
    <>
      <div id="header">
        <div id="leftHeader">
          <img src={menuIcon} alt="Menu" />
        </div>
        <div id="rightHeader">
          <h3>Edit Class</h3>
          <h3>Randomize Group</h3>
        </div>
      </div>
    </>
  );
};
export default Header;
