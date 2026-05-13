import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

function LoginModal({ close }) {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const result = await login(studentId, password);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/ranking");
            close();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="title">로그인</h2>
                <hr className="divider" />
                <div style={{ padding: "0 10px", }}>
                    <p className="subtitle" style={{ fontFamily: "PC-bold", padding: "8px 0" }}>학번 입력</p>
                    <input className="input-full" style={{ width: "100%" }}
                        placeholder="학번 7자리"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                </div>
                <div style={{ padding: "15px 10px 0 10px", }}>
                    <p className="subtitle" style={{ fontFamily: "PC-bold", padding: "8px 0" }}>비밀번호 입력</p>
                    <div style={{ position: "relative", width: "100%" }}>
                        <input className="input-full" style={{ width: "100%", paddingRight: "60px", boxSizing: "border-box" }}
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none",
                                color: "#919191", fontSize: "12px",
                            }}>
                            {showPassword ? "숨기기" : "보기"}
                        </button>
                    </div>
                </div>


                <button className="btn-lg"
                    style={{
                        marginTop: "50px", display: "block",
                        marginLeft: "auto", marginRight: "auto"
                    }}
                    onClick={handleLogin}>로그인</button>
            </div>
        </div>

    );
}

export default LoginModal;