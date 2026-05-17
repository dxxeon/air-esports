import React, { useState } from "react";
import { addRummikubPlayer } from "../api/api";

function AddPlayerModal({ close, onAdded }) {
    const [nickname, setNickname] = useState("");
    const [department, setDepartment] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!nickname.trim() || !department) {
            alert("닉네임과 학과를 모두 선택해주세요.");
            return;
        }

        setIsSaving(true);
        try {
            await addRummikubPlayer({
                nickname: nickname.trim(),
                department: department
            });
            alert("참가자가 성공적으로 추가되었습니다!");
            onAdded(); // 부모 페이지 목록 새로고침
            close();   // 모달 닫기
        } catch (err) {
            alert("참가자 등록 실패: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={close}>
            {/* 이벤트 버블링 방지 */}
            <div className="modal-content-secondary" onClick={(e) => e.stopPropagation()} style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="title" style={{ fontSize: "18px" }}>참가자 추가</h3>
                    <p onClick={close} style={{ cursor: "pointer", fontSize: "16px", color: "#919191", fontFamily: "PC-bold" }}>X</p>
                </div>
                <hr className="divider" />

                {/* 닉네임 입력 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <span className="subtitle" style={{ fontSize: "14px" }}>닉네임</span>
                    <input 
                        className="input-right"
                        placeholder="닉네임 입력"
                        value={nickname}
                        maxLength={8}
                        onChange={(e) => setNickname(e.target.value)}
                        style={{ width: "130px" }}
                    />
                </div>

                {/* 학과 선택 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <span className="subtitle" style={{ fontSize: "14px" }}>학과/전공</span>
                    <select 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{ width: "130px", marginTop: 0, padding: "5px 10px" }}
                    >
                        <option value="">선택</option>
                        <option value="데이터사이언스전공">데사</option>
                        <option value="사이버보안학과">사보</option>
                        <option value="인공지능전공">인지</option>
                        <option value="인공지능데이터사이언스학부">인데부</option>
                        <option value="컴퓨터공학과">컴공</option>
                    </select>
                </div>

                <button 
                    className="btn-lg" 
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ width: "100%", maxWidth: "100%", display: "block", margin: "0 auto" }}
                >
                    {isSaving ? "등록 중..." : "완료"}
                </button>
            </div>
        </div>
    );
}

export default AddPlayerModal;