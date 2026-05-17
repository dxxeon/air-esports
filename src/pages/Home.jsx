import { useState } from "react";

import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import Footer from "../components/Footer";

function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <div className="background" style={{display: "flex", flexDirection: "column", alignItems: "center", }}>
      <h1 style={{marginTop: "240px",fontFamily: "PCP-bold", fontSize: "22px"}}>26-1 인공지능대학</h1>
      <h1 style={{marginBottom: "80px", fontFamily: "PCP-bold", fontSize: "36px"}}>e스포츠 대회</h1>

      <button style={{marginBottom: "10px",}} className="btn-home" onClick={() => setLoginOpen(true)}>
        로그인
      </button>

      <button className="btn-home" onClick={() => setSignupOpen(true)}>
        회원가입
      </button>

      {loginOpen && (
        <LoginModal
          close={() => setLoginOpen(false)}
        />
      )}

      {signupOpen && (
        <SignupModal
          close={() => setSignupOpen(false)}
        />
      )}
      <Footer />
    </div>

  );
}

export default Home;