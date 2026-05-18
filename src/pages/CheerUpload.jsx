import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCheerMessage } from "../api/api";

function CheerUpload() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // 1. 내 가입 정보(로컬스토리지)에서 학과 자동 추출
    const user = JSON.parse(localStorage.getItem("user"));
    const myDepartment = user?.department || "컴퓨터공학과"; // 만약을 대비한 기본값 처리

    // 학과 변환용 매핑 딕셔너리
    const deptLabels = {
        "데이터사이언스전공": "데사",
        "사이버보안학과": "사보",
        "인공지능전공": "인지",
        "인공지능데이터사이언스학부": "인데부",
        "컴퓨터공학과": "컴공"
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            alert("응원 메시지를 입력해 주세요!");
            return;
        }
        if (message.length > 30) {
            alert("메시지는 30자 이내로 작성해 주세요.");
            return;
        }

        setIsSaving(true);
        try {
            await uploadCheerMessage(myDepartment, message.trim());
            alert("응원이 등록되었습니다");
            navigate("/cheer-list"); // 조회 페이지로 이동
        } catch (err) {
            alert("등록 실패: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="app-wrapper">
            <div className="mobile-container">
                <div className="safearea"></div>
                
                <h3 className="title" style={{ fontSize: "22px", textAlign: "center", marginBottom: "25px" }}>응원 메시지 등록</h3>
                
                <div className="box" style={{ padding: "20px" }}>
                    {/* 학과 자동 선택 및 고정 구역 */}
                    <div style={{ marginBottom: "18px" }}>
                        <p className="subtitle" style={{ fontSize: "14px", marginBottom: "6px" }}>소속 학과 (변경 불가)</p>
                        <select value={myDepartment} disabled style={{ backgroundColor: "#f5f5f5", color: "#6f6f6f", cursor: "not-allowed" }}>
                            <option value={myDepartment}>{deptLabels[myDepartment] || myDepartment}</option>
                        </select>
                    </div>

                    {/* 메시지 입력 및 글자 수 체크 구역 */}
                    <div style={{ marginBottom: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <p className="subtitle" style={{ fontSize: "14px", margin: 0 }}>응원 내용 (30자 이내)</p>
                            <span style={{ fontSize: "12px", color: message.length > 30 ? "red" : "#c885ff", fontFamily: "PC-bold" }}>
                                {message.length} / 30자
                            </span>
                        </div>
                        <input
                            className="input-full"
                            placeholder="응원 메시지를 적어 주세요"
                            value={message}
                            maxLength={35} // 여유분을 주되 30자 넘으면 카운터 색상으로 경고
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                {/* 하단 제어 버튼 그룹 */}
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                    <button 
                        className="btn-lg" 
                        onClick={() => navigate("/cheer-list")}
                        style={{ backgroundColor: "white", border: "1px solid #e0e0e0", color: "#868686", flex: 1 }}
                    >
                        취소
                    </button>
                    <button 
                        className="btn-lg" 
                        onClick={handleSubmit}
                        disabled={isSaving || message.length > 30}
                        style={{ flex: 1 }}
                    >
                        {isSaving ? "등록 중..." : "등록"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheerUpload;