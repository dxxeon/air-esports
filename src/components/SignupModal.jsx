import { useMemo, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import SignupConfirmModal from "./SignupConfirmModal";
import { QueryFieldFilterConstraint } from "firebase/firestore";

function SignupModal({ close }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [department, setDepartment] = useState("");
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

    useEffect(() => {
        const checkNickname = async () => {
            if (nickname.trim().length < 2) {
                setIsNicknameDuplicate(false);
                return;
            }
            try {
                const q = query(collection(db, "users"), where("nickname", "==", nickname));
                const querySnapshot = await getDocs(q);
                // 검색 결과가 있으면 중복
                setIsNicknameDuplicate(!querySnapshot.empty);
            } catch (err) {
                console.error("닉네임 체크 에러:", err);
            }
        };
        const timeoutId = setTimeout(checkNickname, 500);
        return () => clearTimeout(timeoutId);
    }, [nickname]);

    const isValid = useMemo(() => {
        return (
            name &&
            nickname &&
            !isNicknameDuplicate &&
            department &&
            studentId.length === 7 &&
            password.length >= 4 &&
            password === passwordCheck
        );
    }, [
        name,
        nickname, isNicknameDuplicate,
        department,
        studentId,
        password,
        passwordCheck,
    ]);

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2 className="title">회원가입</h2>
                    <hr className="divider" />
                    <p style={{ fontSize: "12px", color: "#919191", marginBottom: "15px" }}>
                        입력하신 정보는 <strong>랭킹 중복 등록 방지, 우승 상품 수령자 식별</strong>을 위해 활용되며 행사가 끝난 후 전부 폐기됩니다.
                    </p>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%", padding: "10px",
                    }}>
                        <p className="subtitle">성함</p>
                        <input className="input-right"
                            placeholder="성함"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%", padding: "10px",
                    }}>
                        <div>
                            <p className="subtitle">닉네임</p>
                            <p className="sub-explain">랭킹에 표시되는 닉네임</p>
                        </div>
                        <input className="input-right"
                            placeholder="닉네임"
                            maxLength={10}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    {isNicknameDuplicate && (
                        <p style={{ color: "red", fontSize: "10px", paddingLeft: "10px", marginTop: "-10px"}}>이미 사용 중인 닉네임입니다.</p>
                    )}
                    <div style={{ padding: "10px", }}>
                        <p className="subtitle">학과(전공)</p>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">학과 선택</option>
                            <option>데이터사이언스전공</option>
                            <option>사이버보안학과</option>
                            <option>인공지능학과</option>
                            <option>인공지능데이터사이언스학부</option>
                            <option>컴퓨터공학과</option>
                        </select>
                    </div>

                    <hr className="divider" />
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%", padding: "10px",
                    }}>
                        <div>
                            <p className="subtitle">학번 7자리</p>
                            <p className="sub-explain">로그인 시 아이디로 사용</p>
                        </div>
                        <input className="input-right"
                            placeholder="학번"
                            value={studentId}
                            maxLength={7}
                            onChange={(e) =>
                                setStudentId(
                                    e.target.value.replace(/[^0-9]/g, "")
                                )
                            }
                        />
                    </div>

                    <div style={{ padding: "10px", }}>
                        <p className="subtitle" style={{ paddingBottom: "10px" }}>비밀번호 4~10자리</p>
                        <input className="input-full" style={{ width: "100%", marginBottom: "7px" }}
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input className="input-full" style={{ width: "100%" }}
                            type="password"
                            placeholder="비밀번호 재입력"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                    </div>


                    {password !== passwordCheck && (
                        <p style={{ color: "red", fontSize: "12px", paddingLeft: "12px", marginTop: "-3px" }}>
                            비밀번호가 일치하지 않습니다.
                        </p>
                    )}

                    <button className="btn-lg"
                        style={{
                            marginTop: "30px", display: "block",
                            marginLeft: "auto", marginRight: "auto"
                        }}
                        disabled={!isValid}
                        onClick={() => setConfirmOpen(true)}
                    >
                        회원가입
                    </button>


                    {confirmOpen && (
                        <SignupConfirmModal
                            close={() => setConfirmOpen(false)}
                            data={{
                                name,
                                nickname,
                                department,
                                studentId,
                                password,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignupModal;