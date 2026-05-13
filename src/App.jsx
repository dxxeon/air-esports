import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import MyRecord from "./pages/MyRecord";
import UploadScore from "./pages/UploadScore";

function App() {
  return (
    <div className="app-wrapper">
      <div className="mobile-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/my-record" element={<MyRecord />} />
            <Route path="/upload" element={<UploadScore />} />
          </Routes>
        </BrowserRouter>
      </div>

      <Analytics/>
    </div>
  );
}

export default App;