import React from "react";

// 학과 풀네임을 시안처럼 짧게 줄여주는 매핑 오브젝트
const deptMap = {
    "데이터사이언스전공": "데사",
    "사이버보안학과": "사보",
    "인공지능전공": "인지",
    "인공지능데이터사이언스학부": "인데부",
    "컴퓨터공학과": "컴공"
};

function RummikubTable({ type, data }) {
    // type이 "personal"이면 개인 순위, "dept"면 학과별 순위
    const isPersonal = type === "personal";

    return (
        <div className="table-wrapper"
        >
            <table className="ranking-table"
                style={{ borderCollapse: "separate", borderSpacing: "0 0" }}
            >
                <colgroup>
                    <col style={{ width: "35px" }} />
                    <col style={{ width: "115px" }} />
                    {isPersonal && <col style={{ width: "50px" }} />}
                    <col style={{ width: "65px" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>{isPersonal ? "닉네임" : "학과"}</th>
                        {isPersonal && <th>학과</th>}
                        <th>점수</th>
                    </tr>
                </thead>

                <tbody style={{ textAlign: "center" }}>
                    {(() => {
                        let currentRank = 1; // 💡 시작 등수는 1등
                        let prevScore = null;

                        return data.map((row, index) => {
                            if (type === "personal") {
                                if (index > 0) {
                                    // ⭐ [핵심 변경] 이전 사람 점수와 내 점수가 다를 때만 등수를 "딱 1만" 올려줍니다!
                                    // 이렇게 하면 앞사람들이 동점이어도 순위가 뒤로 밀리지 않고 촘촘하게 누적됩니다.
                                    if (row.score !== prevScore) {
                                        currentRank += 1;
                                    }
                                }
                                prevScore = row.score;
                            } else {
                                // 학과별 순위(평균)일 때는 기존대로 index + 1 순차 적용
                                currentRank = index + 1;
                            }

                            return (
                                <tr key={index}>
                                    {/* 💡 계산 완료된 currentRank를 찍어줍니다. */}
                                    <td style={{ fontFamily: 'PCP-bold', fontSize: "18px" }}>
                                        {currentRank}
                                    </td>

                                    {/* 기존에 작성해 두셨던 내부 셀(td) 구조 그대로 유지 */}
                                    {type === "personal" ? (
                                        <>
                                            <td>{row.nickname}</td>
                                            <td>{deptMap[row.department] || row.department}</td>
                                            <td>{row.score}점</td>
                                        </>
                                    ) : (
                                        <>
                                            <td colSpan={2}>{deptMap[row.department] || row.department}</td>
                                            <td>{row.averageScore}점</td>
                                        </>
                                    )}
                                </tr>
                            );
                        });
                    })()}
                </tbody>
                {/* <tbody style={{ textAlign: "center" }}>
                    {data.map((row, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ fontFamily: 'PCP-bold', fontSize: "18px" }}>{index + 1}</td>
                            <td >
                                {isPersonal ? row.nickname : (deptMap[row.department] || row.department)}
                            </td>
                            {isPersonal && (
                                <td >
                                    {deptMap[row.department] || row.department}
                                </td>
                            )}
                            <td>
                                {isPersonal ? `${row.score}점` : `${row.averageScore}점`}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={isPersonal ? 4 : 3} style={{ padding: "20px 0", color: "#919191", fontSize: "14px" }}>
                                등록된 점수가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody> */}
            </table>
        </div>
    );
}

export default RummikubTable;