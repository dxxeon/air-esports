import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import MyRecord from "./pages/MyRecord";
import UploadScore from "./pages/UploadScore";

//루미큐브
import RummikubHome from "./pages/RummikubHome";
import AdminPlayers from "./pages/AdminPlayers";
import AdminScoreInput from "./pages/AdminScoreInput";

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

            {/* 루미큐브 */}
            <Route path="/rummikub" element={<RummikubHome />} />
            <Route path="/admin/players" element={<AdminPlayers />} />
            <Route path="/admin/score-input" element={<AdminScoreInput />} />
          </Routes>
        </BrowserRouter>
      </div>

      <Analytics />
    </div>
  );
}

export default App;