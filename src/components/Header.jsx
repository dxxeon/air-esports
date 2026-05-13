import { useNavigate } from "react-router-dom";

import { getUser } from "../utils/auth";

function Header({
  showRanking,
  showRecord,
  showUpload,
}) {
  const navigate = useNavigate();

  const user = getUser();

  return (
    <div>
      <p>
        {user.nickname} | {user.department}
      </p>

      {showRanking && (
        <button
          onClick={() => navigate("/ranking")}
        >
          전체 랭킹 보기
        </button>
      )}

      {showRecord && (
        <button
          onClick={() => navigate("/my-record")}
        >
          내 기록 보기
        </button>
      )}

      {showUpload && (
        <button
          onClick={() => navigate("/upload")}
        >
          점수 업로드
        </button>
      )}
    </div>
  );
}

export default Header;