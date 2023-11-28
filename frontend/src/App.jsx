import "./scss/Main.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./Routes/Index";
import Test from "./Routes/File_Test";

function App() {
  /* DETTA ÄR BARA ROUTER, ÄNDRA INGET HÄR */
  return (
    <div id="container">
      <Router>
        <Routes>
          <Route path="/">
            <Route>
              <Route index element={<Index />} />
              <Route path="Test" element={<Test />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
