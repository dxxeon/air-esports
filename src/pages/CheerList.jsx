import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCheerMessages } from "../api/api";

function CheerList() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("데이터사이언스전공");
    const [loading, setLoading] = useState(true);

    const tabs = [
        { key: "데이터사이언스전공", label: "데사" },
        { key: "사이버보안학과", label: "사보" },
        { key: "인공지능전공", label: "인지" },
        { key: "인공지능데이터사이언스학부", label: "인데부" },
        { key: "컴퓨터공학과", label: "컴공" }
    ];

    useEffect(() => {
        const fetchCheers = async () => {
            try {
                const data = await getCheerMessages();
                setMessages(data);
            } catch (err) {
                console.error("응원 메시지 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCheers();
    }, []);

    // 현재 선택된 학과의 메시지만 필터링
    const filteredMessages = messages.filter(m => m.department === activeTab);

    if (loading) {
        return (
            <div className="app-wrapper">
                <div className="mobile-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontFamily: "PC-regular" }}>로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-wrapper">
            <div className="mobile-container" style={{ position: "relative", paddingBottom: "80px" }}>
                <div className="safearea"></div>

                <h3 className="title" style={{ fontSize: "22px", textAlign: "center" }}>우리 과 응원하기</h3>
                <p style={{ textAlign: "center", fontSize: "12px", color: "#919191", marginBottom: "15px" }}>
                    우리 과를 향한 응원의 메시지를 남겨보세요!
                </p>

                {/* 학과별 상단 탭 슬라이더 */}
                <div style={{
                    display: "flex",
                    gap: "3px",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    paddingBottom: "10px",
                    marginBottom: "15px",
                    justifyContent: "center"
                }} className="no-scrollbar">
                    {tabs.map(t => {
                        const messageCount = messages.filter(m => m.department === t.key).length;


                        return (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    border: activeTab === t.key ? "1px solid #c885ff" : "1px solid #e0e0e0",
                                    backgroundColor: activeTab === t.key ? "#ECE0FF" : "white",
                                    color: activeTab === t.key ? "#c885ff" : "#6f6f6f",
                                    fontFamily: activeTab === t.key ? "PC-bold" : "PC-regular",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    display: "flex,", alignItems: "center", gap: "5px"
                                }}
                            ><span>{t.label}</span>
                                <span style={{
                                    fontSize: "11px",
                                    opacity: activeTab === t.key ? 1 : 0.6,
                                    fontFamily: "PC-regular"
                                }}> | {messageCount} </span>
                            </button>
                        )
                    })}
                </div>

                {/* 응원 메시지 리스트 영역 */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "60vh", width: "350px",
                    overflowY: "auto",
                    paddingRight: "4px",
                    alignItems: "center",
                    margin: "0 auto"
                }}>
                    {filteredMessages.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#b3b3b3", fontSize: "13px", marginTop: "40px", fontFamily: "PC-regular" }}>
                            아직 등록된 응원이 없습니다.<br />첫 응원의 주인공이 되어보세요!
                        </p>
                    ) : (
                        filteredMessages.map(m => (
                            <div
                                key={m.id}
                                style={{
                                    padding: "14px 18px",
                                    borderRadius: "15px",
                                    backgroundColor: "white",
                                    boxShadow: "0px 2px 6px rgba(0,0,0,0.04)",
                                    border: "1px solid #f0f0f0",
                                    animation: "modalFadeIn 0.3s ease-out",

                                }}
                            >
                                <p style={{ fontSize: "11px", color: "#333", margin: 0, lineHeight: "1.4", fontFamily: "PC-regular", wordBreak: "break-all" }}>
                                    {m.message}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* 우측 하단 한줄 응원 등록하러 가기 플로팅 버튼 */}
                <button
                    className="btn-sm btn-green"
                    onClick={() => navigate("/cheer-upload")}
                    style={{
                        position: "fixed",
                        bottom: "80px",
                        borderRadius: "25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "10px 18px",
                        boxShadow: "0px 4px 10px rgba(0, 121, 32, 0.4)",
                        fontFamily: "PC-bold"
                    }}
                >
                    📣 응원하기
                </button>
                <button 
                onClick={() => navigate("/ranking")} // 기존 서비스 메인 url 경로에 맞게 수정하세요 (예: "/" 또는 "/home")
                style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#868686", 
                    fontSize: "12px", 
                    cursor: "pointer", 
                    fontFamily: "PC-regular",
                    marginTop: "50px",
                    textDecoration: "underline",
                    position: "fixed",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                }}
            >
                돌아가기
            </button>
            </div>
        </div>
    );
}

export default CheerList;