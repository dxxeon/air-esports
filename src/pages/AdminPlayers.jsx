import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRummikubPlayers } from "../api/api";
import AddPlayerModal from "../components/AddPlayerModal";
import RummikubFooter from "../components/RummikubFooter";

function AdminPlayers() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("데이터사이언스전공"); // 기본 첫 번째 탭
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 5대 학과 정의
    const tabs = [
        { key: "데이터사이언스전공", label: "데사" },
        { key: "사이버보안학과", label: "사보" },
        { key: "인공지능전공", label: "인지" },
        { key: "인공지능데이터사이언스학부", label: "인데부" },
        { key: "컴퓨터공학과", label: "컴공" }
    ];

    // 명단 리로드 함수
    const loadPlayers = async () => {
        try {
            const data = await getRummikubPlayers();
            setPlayers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlayers();
    }, []);

    // 현재 선택한 학과의 유저 필터링
    const filteredPlayers = players.filter(p => p.department === activeTab);

    return (
        <div>
            <div className="safearea"></div>
            <div className="box" style={{ maxHeight: "600px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="title" style={{ fontSize: "22px" }}>참가자 관리</h3>
                </div>
                <hr className="divider" style={{ marginBottom: "10px" }} />

                {/* 피그마 스타일 5단 학과 선택 탭 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", width: "100%", gap: "2px" }}>
                    {tabs.slice(0, 3).map(tab => (
                        <button 
                            key={tab.key}
                            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", width: "100%", gap: "2px", marginTop: "2px", marginBottom: "15px" }}>
                    {tabs.slice(3, 5).map(tab => (
                        <button 
                            key={tab.key}
                            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 참가자 명단 스크롤 박스 영역 */}
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #d9d9d9", borderRadius: "10px", padding: "5px 0" }}>
                    {loading ? (
                        <p style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#6f6f6f" }}>명단 불러오는 중...</p>
                    ) : filteredPlayers.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#919191" }}>등록된 참가자가 없습니다.</p>
                    ) : (
                        filteredPlayers.map((player, idx) => (
                            <div key={player.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: idx !== filteredPlayers.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                                <span style={{ fontFamily: "PCP-bold", color: "#6f6f6f" }}>{idx + 1}</span>
                                <span style={{ fontFamily: "PC-regular" }}>{player.nickname}</span>
                                <span style={{ fontSize: "12px", color: "#919191" }}>
                                    {tabs.find(t => t.key === player.department)?.label}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* 추가하기 버튼 */}
                <button 
                    className="btn-sm btn-green" 
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: "block", margin: "15px auto 0 auto", width: "110px", padding: "5px 0" }}
                >
                    + 추가하기
                </button>

                <hr className="divider" style={{ marginTop: "20px" }} />

                <button 
                    className="btn-lg" 
                    onClick={() => navigate(-1)}
                    style={{ display: "block", margin: "0 auto" }}
                >
                    완료
                </button>
            </div>

            {/* 참가자 추가 모달 팝업 연결 */}
            {isModalOpen && (
                <AddPlayerModal 
                    close={() => setIsModalOpen(false)} 
                    onAdded={loadPlayers} 
                />
            )}

            <RummikubFooter />
        </div>
    );
}

export default AdminPlayers;