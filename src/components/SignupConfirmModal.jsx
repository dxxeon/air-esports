import { useState } from "react";
import { signup } from "../api/api";

function SignupConfirmModal({ close, data }) {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignup = async () => {
        try {
            const result = await signup(data);

            if (result.success) {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "회원가입 중 오류가 발생했습니다.");
        }
    };

    const handleFinish = () => {
        window.location.href = "/";
    }

    return (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={close}>
            <div className="modal-content-secondary" style={{ maxWidth: "280px" }} onClick={(e) => e.stopPropagation()}>
                {!isSuccess ? (
                    <div style={{ textAlign: "center", }}>
                        <p style={{ marginBottom: "35px" }}>★</p>
                        <p style={{ fontSize: "20px", paddingBottom: "2px" }}>정보를 정확히 입력하셨나요?</p>
                        <p style={{ fontSize: "15px", color: "#919191" }}>최초 가입 이후 정보 수정이 불가합니다.</p>

                        <button className="btn-lg" style={{ marginTop: "35px" }} onClick={handleSignup}>이대로 가입하기</button>
                        <button className="btn-lg" style={{ marginTop: "5px" }} onClick={close}>돌아가기</button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center",}}>
                        <p style={{ marginBottom: "40px" }}>★</p>
                        <p style={{ fontSize: "20px", paddingBottom: "2px" }}>회원가입이 완료되었습니다!</p>

                        <button className="btn-lg" style={{ marginTop: "40px" }} onClick={handleFinish}>확인</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SignupConfirmModal;