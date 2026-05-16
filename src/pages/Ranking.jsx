import { useState, useEffect } from "react";
import { getRankings } from "../api/api";
// import Header from "../components/Header";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";

function Ranking() {
    const [game, setGame] = useState("사과게임");
    const [allData, setAllData] = useState({"사과게임":[],"눈빛보내기":[]});
    const [isLoading, setIsLoading] = useState(true);
    // const [myRanks, setMyRanks] = useState({ apple: "-", eyes: "-" });
    // const [rankings, setRankings] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [apple, eyes] = await Promise.all([
                    getRankings("사과게임"),
                    getRankings("눈빛보내기")
                ]);
                
                setAllData({
                    "사과게임": apple,
                    "눈빛보내기": eyes
                });
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // useEffect(() => {
    //     const fetchRankings = async () => {
    //         try {
    //             const data = await getRankings(game);
    //             setRankings(data);

    //             const myIndex = data.findIndex((r) => r.nickname === user?.nickname);
    //             const currentRank = myIndex !== -1 ? `${myIndex + 1}` : "-";

    //         } catch (err) {
    //             console.error("랭킹 로딩 실패:", err);
    //         }
    //     };
    //     fetchRankings();
    // }, [game]);

    // useEffect(() => {
    //     const fetchInitialMyRanks = async () => {
    //         const appleData = await getRankings("사과게임");
    //         const eyesData = await getRankings("눈빛보내기");

    //         const aIndex = appleData.findIndex((r) => r.nickname === user?.nickname);
    //         const eIndex = eyesData.findIndex((r) => r.nickname === user?.nickname);

    //         setMyRanks({
    //             apple: aIndex !== -1 ? aIndex + 1 : "-",
    //             eyes: eIndex !== -1 ? eIndex + 1 : "-"
    //         });
    //     };
    //     if (user?.nickname) fetchInitialMyRanks();
    // }, []);

    // const myRankIndex = rankings.findIndex((r) => r.nickname === user?.nickname);
    // const myRank = myRankIndex !== -1 ? myRankIndex + 1 : "-";

    const currentRankings = allData[game] || [];
    
    const getMyRank = (gameType) => {
        const data = allData[gameType];
        const index = data.findIndex((r) => r.nickname === user?.nickname);
        return index !== -1 ? `${index + 1}` : "-";
    };

    const deptMap = {
        "데이터사이언스전공": "데사",
        "사이버보안학과": "사보",
        "인공지능전공": "인지",
        "인공지능데이터사이언스학부": "인데부",
        "컴퓨터공학과": "컴공",
    };

    const formatScore = (score, gameType) => {
        if (gameType === "사과게임") return `${score}점`;
        if (gameType === "눈빛보내기") return `${(score / 1000).toFixed(1)}k`;
        return score;
    };

    // const formatScore = (score, gameType) => {
    //     if (gameType === "사과게임") {
    //         return `${score}점`;
    //     } else if (gameType === "눈빛보내기") {
    //         const kScore = (score / 1000).toFixed(1);
    //         return `${kScore}k`;
    //     }
    //     return score;
    // };

    return (
        <div className="background">
            {/* <Header showRecord /> */}
            <div className="safearea"></div>
            <div className="box">
                <div className="inbox-top"
                    style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="player-info">
                        <p className="title"> {user?.nickname} </p>
                        <p className="player-depart"> {user?.department} </p>
                    </div>
                    <div className="btn-list">
                        <button className="btn-sm btn-purple"
                            onClick={() => navigate("/my-record")}
                        >
                            내 기록 보기
                        </button>
                        <button className="btn-sm btn-green"
                            onClick={() => navigate("/upload")}
                        >
                            점수 업로드
                        </button>
                    </div>
                </div>
                <hr className="divider" />
                <div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "60px", paddingTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "3px" }}>
                            <p className="myrank-name">사과게임</p>
                            <p className="myrank-rank">{getMyRank("사과게임")}위</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "3px" }}>
                            <p className="myrank-name">눈빛 보내기</p>
                            <p className="myrank-rank">{getMyRank("눈빛보내기")}위</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="box" style={{ marginTop: "15px", maxHeight: "360px" }}>
                <h2 className="title" style={{ marginBottom: "5px" }}>실시간 랭킹</h2>
                <div className="tab-group" style={{ display: "flex", marginBottom: "5px", }}>
                    <button
                        className={`tab-btn ${game === "사과게임" ? "active-apple" : ""}`}
                        onClick={() => setGame("사과게임")}
                        style={{ borderRadius: "0 0 0 10px" }}
                    >
                        사과게임 🍎
                    </button>
                    <button
                        className={`tab-btn ${game === "눈빛보내기" ? "active-eyes" : ""}`}
                        onClick={() => setGame("눈빛보내기")}
                        style={{ borderRadius: "0 0 10px 0" }}
                    >
                        눈빛보내기 💘
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ textAlign: "center", padding: "20px" }}>랭킹 불러오는 중...</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="ranking-table" style={{ borderCollapse: "separate", borderSpacing: "0 0" }}>
                    <colgroup>
                        <col style={{ width: "35px" }} />
                        <col style={{ width: "115px" }} />
                        <col style={{ width: "50px" }} />
                        <col style={{ width: "65px" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>닉네임</th>
                            <th>학과</th>
                            <th>점수</th>
                        </tr>
                    </thead>

                    <tbody style={{ textAlign: "center" }}>
                        {currentRankings.map((row, index) => (
                            <tr key={index}>
                                <td style={{ fontFamily: 'PCP-bold', fontSize: "18px" }}>{index + 1}</td>
                                <td>{row.nickname}</td>
                                <td>{deptMap[row.department] || row.department}</td>
                                <td>{formatScore(row.score, game)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                )}
            </div>

            <div className="logout-wrapper">
                <LogoutButton />
            </div>
            <Footer />

        </div>
    );
}

export default Ranking;