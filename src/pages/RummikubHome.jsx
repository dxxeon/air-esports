import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRummikubPlayers, getRummikubScores } from "../api/api";
import RummikubTable from "../components/RummikubTable";
import RummikubFooter from "../components/RummikubFooter";
import LogoutButton from "../components/LogoutButton";

function RummikubHome() {
    const navigate = useNavigate();
    
    // 1. 로그인 정보 및 관리자(Admin) 여부 판별
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin"; // 로컬스토리지에 role: "admin"이 있다고 가정

    // 2. 상태 관리 (데이터 및 로딩, 탭)
    const [players, setPlayers] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("personal"); // "personal" 또는 "dept"

    // 학과별 인원 카운트용 리스트
    const departmentsList = [
        { key: "데이터사이언스전공", label: "데사" },
        { key: "사이버보안학과", label: "사보" },
        { key: "인공지능전공", label: "인지" },
        { key: "인공지능데이터사이언스학부", label: "인데부" },
        { key: "컴퓨터공학과", label: "컴공" }
    ];

    // 3. 파이어베이스 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playersData, scoresData] = await Promise.all([
                    getRummikubPlayers(),
                    getRummikubScores()
                ]);
                setPlayers(playersData);
                setScores(scoresData);
            } catch (err) {
                console.error("루미큐브 홈 데이터 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 4. [계산 로직 ①] 학과별 참가자 수 카운트
    const getDeptPlayerCount = (deptName) => {
        return players.filter(p => p.department === deptName).length;
    };

    // ========================================================
    // ✅ [수정된 로직 5번] 개인 순위 정렬 (2회 누적 점수 합산형)
    // ========================================================
    const getPersonalRankings = () => {
        const userTotals = {}; // { "김이화": { department: "컴공", totalScore: 175 } }

        scores.forEach(game => {
            game.players.forEach(p => {
                // ★ 출석하고 점수가 입력된 경우만 누적 계산
                if (p.isAttended && p.score !== "") {
                    if (!userTotals[p.nickname]) {
                        userTotals[p.nickname] = {
                            department: p.department,
                            totalScore: 0
                        };
                    }
                    // 동일한 닉네임이 발견되면 기존 점수에 계속 더합니다!
                    userTotals[p.nickname].totalScore += Number(p.score);
                }
            });
        });

        // 객체를 배열로 변환
        const personalList = Object.keys(userTotals).map(nickname => ({
            nickname: nickname,
            department: userTotals[nickname].department,
            score: userTotals[nickname].totalScore // 2회 총합 점수
        }));

        // 총합 점수가 높은 순으로 정렬
        return personalList.sort((a, b) => b.score - a.score);
    };

    // ========================================================
    // ✅ [수정된 로직 6번] 학과별 순위 정렬 (인당 '총합 점수'의 평균)
    // ========================================================
    const getDeptRankings = () => {
        const userTotals = {}; // 우선 각 유저별로 2판의 합산 점수를 먼저 구함

        scores.forEach(game => {
            game.players.forEach(p => {
                if (!p.isAttended || p.score === "") return;
                
                if (!userTotals[p.nickname]) {
                    userTotals[p.nickname] = { department: p.department, sum: 0 };
                }
                userTotals[p.nickname].sum += Number(p.score);
            });
        });

        // 유저별 합산 점수를 바탕으로 학과별 최종 통계 집계
        const deptTotals = {}; // { "컴공": { grandTotal: 350, uniquePlayers: 2 } }

        Object.keys(userTotals).forEach(nickname => {
            const p = userTotals[nickname];
            if (!deptTotals[p.department]) {
                deptTotals[p.department] = { grandTotal: 0, playerNames: new Set() };
            }
            deptTotals[p.department].grandTotal += p.sum;
            deptTotals[p.department].playerNames.add(nickname);
        });

        // 학과별 인당 평균 점수 환산
        const deptRankingArray = Object.keys(deptTotals).map(dept => {
            const total = deptTotals[dept].grandTotal;
            const count = deptTotals[dept].playerNames.size; // 학과별 순수 참여 인원수
            const average = count > 0 ? (total / count).toFixed(1) : 0;
            
            return {
                department: dept,
                averageScore: Number(average)
            };
        });

        // 평균 점수 높은 순 정렬
        return deptRankingArray.sort((a, b) => b.averageScore - a.averageScore);
    };

    if (loading) {
        return (
            <div className="app-wrapper">
                <div className="mobile-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontFamily: "PC-regular" }}>루미큐브 데이터 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="safearea"></div>
            
            {/* ─── 상단 카드: 학과별 참가자 수 ─── */}
            <div className="box" style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="title" style={{ fontSize: "20px" }}>학과별 참가자 수</h3>
                    {/* ★ 관리자일 때만 [참가자 관리] 버튼이 뚫립니다 */}
                    {isAdmin && (
                        <button className="btn-sm btn-purple" onClick={() => navigate("/admin/players")}>
                            참가자 관리
                        </button>
                    )}
                </div>
                <hr className="divider" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center", marginTop: "10px" }}>
                    {departmentsList.map((dept, idx) => (
                        <div key={idx} style={{ padding: "5px" }}>
                            <p className="player-depart" style={{ fontSize: "13px" }}>{dept.label}</p>
                            <p style={{ fontFamily: "PCP-bold", fontSize: "18px", marginTop: "2px" }}>
                                {getDeptPlayerCount(dept.key)}명
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── 하단 카드: 실시간 랭킹 조회 ─── */}
            <div className="box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className="title" style={{ fontSize: "20px" }}>실시간 랭킹</h3>
                    {/* ★ 관리자일 때만 [점수 입력] 버튼이 뚫립니다 */}
                    {isAdmin && (
                        <button className="btn-sm btn-purple" onClick={() => navigate("/admin/score-input")}>
                            점수 입력
                        </button>
                    )}
                </div>
                
                {/* 탭 버튼 영역 */}
                <div className="tab-group" style={{ display: "flex", margin: "5px 0",}}>
                    <button 
                        className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
                        onClick={() => setActiveTab("personal")}
                        style={{ borderRadius: "0 0 0 10px" }}
                    >
                        개인 순위
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "dept" ? "active" : ""}`}
                        onClick={() => setActiveTab("dept")}
                        style={{ borderRadius: "0 0 10px 0" }}
                    >
                        학과별 순위
                    </button>
                </div>

                {/* 랭킹 테이블 렌더링 */}
                <div style={{ marginTop: "10px" }}>
                    {activeTab === "personal" ? (
                        <RummikubTable type="personal" data={getPersonalRankings()} />
                    ) : (
                        <RummikubTable type="dept" data={getDeptRankings()} />
                    )}
                </div>
            </div>
            <div className="logout-wrapper">
                <LogoutButton />
            </div>
            <RummikubFooter />
        </div>
    );
}

export default RummikubHome;