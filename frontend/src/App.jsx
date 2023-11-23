import "./scss/Main.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./Routes/Index";

function App() {
  /* DETTA ÄR BARA ROUTER, ÄNDRA INGET HÄR */
  return (
    <div id="container">
      <Router>
        <Routes>
          <Route path="/">
            <Route>
              <Route index element={<Index />} />
              <Route path="Other" element={<Index />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
