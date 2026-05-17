import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import Footer from "../components/Footer";
import { uploadScore } from "../api/api";
import { deleteApp } from "firebase/app";
import RummikubFooter from "../components/RummikubFooter";

function UploadScore() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [game, setGame] = useState("");
  const [score, setScore] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // 로딩 상태 추가

  const handleUpload = async () => {
    if (!game || !score || !image) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    // 로딩 시작
    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = async () => {
      try {
        await uploadScore(
          {
            studentId: user.studentId,
            nickname: user.nickname,
            department: user.department,
            game,
            score: Number(score),
          },
          reader.result
        );

        alert("업로드가 완료되었습니다!");
        navigate("/my-record");
      } catch (err) {
        console.error(err);
        alert("업로드 실패: " + err.message);
      } finally {
        setIsUploading(false);
      }
    };
  };

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
            <button className="btn-sm btn-purple"
              onClick={() => navigate("/my-record")}
            >
              내 기록 보기
            </button>
          </div>
        </div>
        <hr className="divider" />
        <div style={{ padding: "10px 3px", }}>
          <p className="subtitle">종목을 선택해 주세요</p>
          <select style={{ padding: "3px 10px" }}
            value={game} onChange={(e) => setGame(e.target.value)}>
            <option value="">종목 선택</option>
            <option value="사과게임">사과게임</option>
            <option value="눈빛보내기">눈빛 보내기</option>
          </select>
        </div>

        <div style={{ padding: "10px 3px", }}>
          <p className="subtitle" style={{ marginBottom: "2px" }}>점수를 입력해 주세요</p>
          <p className="sub-explain" style={{ marginBottom: "7px" }}>숫자만 입력해 주세요.</p>
          <input className="input-full" style={{ padding: "4px 10px", width: "100%" }}
            placeholder="점수 입력"
            value={score}
            onChange={(e) => setScore(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>

        <div style={{ padding: "10px 3px", }}>
          <p className="subtitle" style={{ marginBottom: "2px", paddingLeft: "2px" }}>결과 화면 사진을 첨부해 주세요</p>

          {/* <p className="sub-explain" style={{ marginBottom: "7px", paddingLeft: "2px" }}>이아이와 함께 찍은 사진만 인정됩니다.</p> */}
          <p className="sub-explain" style={{ whiteSpace: "pre-wrap", marginBottom:"7px", paddingLeft: "2px" }}>
            {game === "사과게임" &&
            `원격 참여자 : 점수 화면과 시간대가 함께 촬영/캡처된 사진
라운지 참여자 : 점수 화면과 이아이가 함께 찍힌 사진
모바일 앱의 경우 클래식 버전만 인정됩니다.`}
            {game === "눈빛보내기" && "최종 점수 화면과 이아이가 함께 찍힌 사진만 인정됩니다."}
            {!game && ""}
          </p>

          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
              }
            }}
          />
          <label htmlFor="file-upload" className="input-full"
            style={{ width: "100%", display: "flex", padding: "4px 10px" }}>
            {image ? image.name : "이미지를 선택하려면 클릭하세요."}
          </label>
        </div>


        <button className="btn-lg"
          style={{ display: "block", margin: "50px auto 15px auto" }} onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "업로드 중..." : "업로드"}
        </button>
      </div>

      <div className="logout-wrapper">
        <LogoutButton />
      </div>
      <RummikubFooter />
      <Footer />
    </div>

  );
}

export default UploadScore;