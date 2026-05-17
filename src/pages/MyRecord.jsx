import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getMyRecords } from "../api/api";
import RummikubFooter from "../components/RummikubFooter";

function MyRecord() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const userData = localStorage.getItem("user");

                if (!userData) {
                    console.error("로그인 정보가 없습니다.");
                    return;
                }

                const user = JSON.parse(userData);

                console.log("현재 로그인된 학번:", user.studentId);

                if (!user.studentId) {
                    alert("학번 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
                    return;
                }

                const data = await getMyRecords(user.studentId);
                setRecords(data);
            } catch (err) {
                console.error("데이터 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, []);

    // if (loading) return <div>로딩 중...</div>;

    return (
        <div>
            <div className="safearea"></div>
            <div className="box" style={{ maxHeight: "600px", }}>
                <div className="inbox-top"
                    style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="player-info">
                        <p className="title"> {user.nickname} </p>
                        <p className="player-depart"> {user.department} </p>
                    </div>
                    <div className="btn-list">
                        <button className="btn-sm btn-purple"
                            onClick={() => navigate("/ranking")}
                        >
                            전체 랭킹 보기
                        </button>
                        <button className="btn-sm btn-green"
                            onClick={() => navigate("/upload")}
                        >
                            점수 업로드
                        </button>
                    </div>
                </div>
                <hr className="divider" />

                <div style={{
                    maxHeight: "370px", overflowY: "auto",
                    width: "100%"
                }}>
                    {records.map((item, index) => {
                        const formattedScore = () => {
                            if (item.game.includes("사과")) {
                                return `${item.score}점`;
                            } else if (item.game.includes("눈빛")) {
                                const kScore = (item.score / 1000).toFixed(1);
                                return `${kScore}k`;
                            }
                            return item.score;
                        };
                    
                    return (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "30px",
                            padding: "12px 0",
                            borderBottom: "1px solid #eeeeee",
                            width: "100%",
                            fontSize: "15px"
                        }}>
                            <span style={{
                                width: "100px",
                                textAlign: "center",
                                flexShrink: 0
                            }}>
                                {item.time}
                            </span>

                            <span style={{
                                width: "50px",
                                textAlign: "center",
                                flexShrink: 0
                            }}>
                                {item.game?.slice(0,2)}
                            </span>

                            <span style={{
                                width: "56px",
                                textAlign: "center",
                                flexShrink: 0,
                                fontWeight: "bold"
                            }}>
                                {formattedScore()}
                            </span>
                        </div>
                    )})}
                </div>


            </div>
            <div className="logout-wrapper">
                <LogoutButton />
            </div>
            <RummikubFooter />
            <Footer />
        </div>
    );
}

export default MyRecord;