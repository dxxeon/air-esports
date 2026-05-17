import React from "react";

// 학과 풀네임을 시안처럼 짧게 줄여주는 매핑 오브젝트
const deptMap = {
    "데이터사이언스전공": "데사",
    "사이버보안학과": "사보",
    "인공지능전공": "인지",
    "인공지능데이터사이언스학부": "인지데",
    "컴퓨터공학과": "컴공"
};

function RummikubTable({ type, data }) {
    // type이 "personal"이면 개인 순위, "dept"면 학과별 순위
    const isPersonal = type === "personal";

    return (
        <div className="table-wrapper"
        >
            <table className="ranking-table"
            style={{ borderCollapse: "separate", borderSpacing: "0 0"}}
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
                </tbody>
            </table>
        </div>
    );
}

export default RummikubTable;