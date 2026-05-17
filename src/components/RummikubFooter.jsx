import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function RummikubFooter() {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 내가 어떤 페이지에 있는지 확인용

    // 로그인 유저 권한 파악
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    // 현재 페이지 경로 저장
    const currentPath = location.pathname;

    return (
        <div
        style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {/* 1. 공통: 루미큐브 메인 홈으로 가기 버튼 (현재 홈이 아닐 때만 노출) */}
            {currentPath !== "/rummikub" && (
                <button 
                    className="rummi-btn" 
                    onClick={() => navigate("/rummikub")}
                >
                    
                </button>
            )}

           
            
            {/* 3. 서비스 최상위 메인 홈으로 완전히 나가는 링크 */}
            {currentPath == "/rummikub" && (
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
                    textDecoration: "underline"
                }}
            >
                돌아가기
            </button>
            )}
        </div>
    );
}

export default RummikubFooter;