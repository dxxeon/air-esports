import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadRummikubScores, getRummikubPlayers } from "../api/api";
import RummikubFooter from "../components/RummikubFooter";

function AdminScoreInput() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    
    // ⭐ 전역 참가자 명단을 담아둘 상태 추가
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. 게임 조 선택 상태
    const [gameGroup, setGameGroup] = useState("");

    // 2. 참가자 4명의 폼 상태 통합 관리 (기본 학과/닉네임은 빈값으로 초기화)
    const [formPlayers, setFormPlayers] = useState([
        { nickname: "", department: "", score: "", isAttended: true },
        { nickname: "", department: "", score: "", isAttended: true },
        { nickname: "", department: "", score: "", isAttended: true },
        { nickname: "", department: "", score: "", isAttended: true },
    ]);

    // 학과 리스트 정의
    const departments = [
        { key: "데이터사이언스전공", label: "데사" },
        { key: "사이버보안학과", label: "사보" },
        { key: "인공지능전공", label: "인지" },
        { key: "인공지능데이터사이언스학부", label: "인데부" },
        { key: "컴퓨터공학과", label: "컴공" }
    ];

    // ⭐ 컴포넌트 켜질 때 파이어베이스에서 등록된 전체 참가자 명단 싹 긁어오기
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getRummikubPlayers();
                setAllPlayers(data);
            } catch (err) {
                console.error("명단 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    // 입력 필드 값 변경 핸들러
    const handleInputChange = (index, field, value) => {
        const updated = [...formPlayers];
        
        if (field === "score") {
            updated[index][field] = value.replace(/[^0-9]/g, "");
        } else if (field === "department") {
            // ⭐ 학과를 바꾸면 이전에 선택되어 있던 닉네임은 자동으로 초기화해 줍니다.
            updated[index][field] = value;
            updated[index]["nickname"] = ""; 
        } else {
            updated[index][field] = value;
        }
        
        setFormPlayers(updated);
    };

    // 불참 체크박스 토글 핸들러
    const handleAttendanceToggle = (index, isChecked) => {
        const updated = [...formPlayers];
        updated[index].isAttended = !isChecked;
        
        if (isChecked) {
            updated[index].score = "0";
        } else {
            updated[index].score = "";
        }
        setFormPlayers(updated);
    };

    // 저장(완료) 버튼 클릭 핸들러
    const handleSubmit = async () => {
        if (!gameGroup) {
            alert("게임을 선택해 주세요.");
            return;
        }

        for (let i = 0; i < formPlayers.length; i++) {
            const p = formPlayers[i];
            if (!p.department || !p.nickname) {
                alert(`참가자 ${i + 1}의 학과와 닉네임을 모두 선택해 주세요.`);
                return;
            }
            if (p.isAttended && p.score === "") {
                alert(`참가자 ${i + 1}의 점수를 입력해 주세요.`);
                return;
            }
        }

        setIsSaving(true);
        try {
            await uploadRummikubScores({
                gameGroup: gameGroup,
                players: formPlayers.map(p => ({
                    nickname: p.nickname,
                    department: p.department,
                    score: Number(p.score),
                    isAttended: p.isAttended
                }))
            });

            alert("점수 등록이 완료되었습니다!");
            navigate("/rummikub"); // ⭐ 싱크 수정한 안부러지는 안심 주소!
        } catch (err) {
            alert("점수 등록 실패: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="app-wrapper">
                <div className="mobile-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontFamily: "PC-regular" }}>참가자 명단 구성 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="safearea"></div>
            <div className="box" style={{ overflowY: "auto", maxHeight: "85vh", paddingBottom: "15px" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="title" style={{ fontSize: "22px" }}>점수 입력</h3>
                </div>
                <hr className="divider" />

                {/* 게임 조 선택 드롭다운 */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p className="subtitle" style={{ fontSize: "15px" }}>게임을 선택해주세요</p>
                        <p style={{ marginLeft: "6px", color: "#c885ff", fontSize: "10px" }}>★</p>
                    </div>
                    <select value={gameGroup} onChange={(e) => setGameGroup(e.target.value)}>
                        <option value="">게임 조 선택</option>
                        <option value="1일차 1타임 - A조">1일차 1타임 - A조</option>
                        <option value="1일차 1타임 - B조">1일차 1타임 - B조</option>
                        <option value="1일차 2타임 - A조">1일차 2타임 - A조</option>
                        <option value="1일차 2타임 - B조">1일차 2타임 - B조</option>
                        <option value="1일차 3타임 - A조">1일차 3타임 - A조</option>
                        <option value="1일차 3타임 - B조">1일차 3타임 - B조</option>
                        <option value="1일차 4타임">1일차 4타임</option>
                        <option value="1일차 5타임 - A조">1일차 5타임 - A조</option>
                        <option value="1일차 5타임 - B조">1일차 5타임 - B조</option>
                        <option value="1일차 5타임 - C조">1일차 5타임 - C조</option>
                        <option value="2일차 1타임 - A조">2일차 1타임 - A조</option>
                        <option value="2일차 1타임 - B조">2일차 1타임 - B조</option>
                        <option value="2일차 1타임 - C조">2일차 1타임 - C조</option>
                        <option value="2일차 2타임 - A조">2일차 2타임 - A조</option>
                        <option value="2일차 2타임 - B조">2일차 2타임 - B조</option>
                        <option value="2일차 2타임 - C조">2일차 2타임 - C조</option>
                        <option value="2일차 3타임 - A조">2일차 3타임 - A조</option>
                        <option value="2일차 3타임 - B조">2일차 3타임 - B조</option>
                        <option value="2일차 4타임 - A조">2일차 4타임 - A조</option>
                        <option value="2일차 4타임 - B조">2일차 4타임 - B조</option>
                        <option value="2일차 5타임">2일차 5타임</option>
                    </select>
                </div>

                <p className="subtitle" style={{ fontSize: "15px", marginBottom: "10px" }}>참가자별 점수를 입력해주세요</p>

                {/* 참가자 4명 폼 바인딩 영역 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {formPlayers.map((player, idx) => {
                        // ⭐ 핵심: 현재 줄에서 선택된 학과(department)에 소속된 선수들만 필터링!
                        const filteredOptions = allPlayers.filter(
                            p => p.department === player.department
                        );

                        return (
                            <div 
                                key={idx} 
                                style={{ 
                                    border: "1px solid #6f6f6f", 
                                    borderRadius: "20px", 
                                    padding: "15px",
                                    backgroundColor: player.isAttended ? "white" : "#f5f5f5",
                                    opacity: player.isAttended ? 1 : 0.8
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ fontFamily: "PC-bold", fontSize: "14px" }}>참가자 {idx + 1}</span>
                                    
                                    <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#919191", cursor: "pointer" }}>
                                        <input 
                                            type="checkbox" 
                                            checked={!player.isAttended}
                                            onChange={(e) => handleAttendanceToggle(idx, e.target.checked)}
                                        />
                                        불참 (랭킹 제외)
                                    </label>
                                </div>

                                {/* 1. 학과 선택 (순서를 닉네임보다 위로 배치해서 동선을 자연스럽게 함) */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span className="sub-explain" style={{ fontSize: "13px", color: "#000" }}>학과/전공</span>
                                    <select 
                                        value={player.department}
                                        onChange={(e) => handleInputChange(idx, "department", e.target.value)}
                                        style={{ width: "147px", marginTop: 0, padding: "4px 10px" }}
                                    >
                                        <option value="">학과 선택</option>
                                        {departments.map(d => (
                                            <option key={d.key} value={d.key}>{d.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. 닉네임 선택 (인풋 태그에서 ➡️ 드롭다운 셀렉트 박스로 파격 변신!) */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span className="sub-explain" style={{ fontSize: "13px", color: "#000" }}>닉네임</span>
                                    <select 
                                        value={player.nickname}
                                        disabled={!player.department} // 학과를 먼저 선택 안 하면 비활성화
                                        onChange={(e) => handleInputChange(idx, "nickname", e.target.value)}
                                        style={{ width: "147px", marginTop: 0, padding: "4px 10px" }}
                                    >
                                        <option value="">
                                            {!player.department ? "학과를 먼저 선택" : "선수 선택"}
                                        </option>
                                        {filteredOptions.map(p => (
                                            <option key={p.id} value={p.nickname}>
                                                {p.nickname}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. 점수 입력 */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span className="sub-explain" style={{ fontSize: "13px", color: "#000" }}>점수</span>
                                    <input 
                                        className="input-right"
                                        placeholder={player.isAttended ? "점수" : "0"}
                                        value={player.score}
                                        disabled={!player.isAttended}
                                        onChange={(e) => handleInputChange(idx, "score", e.target.value)}
                                        style={{ 
                                            padding: "4px 10px",
                                            backgroundColor: player.isAttended ? "white" : "#e9e9e9",
                                            color: player.isAttended ? "black" : "#919191"
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button 
                    className="btn-lg" 
                    onClick={handleSubmit}
                    disabled={isSaving}
                    style={{ display: "block", margin: "25px auto 5px auto" }}
                >
                    {isSaving ? "저장 중..." : "완료"}
                </button>
            </div>
            
            <RummikubFooter />
        </div>
    );
}

export default AdminScoreInput;