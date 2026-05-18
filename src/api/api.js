import { db } from "../firebase";
// firebase/firestore 경로에서 필요한 함수들을 가져옵니다.
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

const GAS_URL = "https://script.google.com/macros/s/AKfycbyFJe-CHycTeR-plggv-WKN_aGvTz_Vk3_K0Ip3ZpJzymnkSIY4PI2lNk2Z_rFjmxnq/exec";

// 1. 회원가입
export const signup = async (userData) => {
  const userRef = doc(db, "users", userData.studentId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    throw new Error("이미 등록된 학번입니다.");
  }
  
  await setDoc(userRef, userData);
  return { success: true };
};

// 2. 로그인
export const login = async (studentId, password) => {
  const userRef = doc(db, "users", studentId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || userSnap.data().password !== password) {
    throw new Error("정보가 일치하지 않습니다.");
  }

  //admin
  const userData = userSnap.data();

  return { success: true,
    user: {
      ...userData,
      role: userData.role || "user"
    }
   };
};

// 3. 내 기록 가져오기 (Firestore 전용)
export const getMyRecords = async (studentId) => {
  try {
    if (!studentId) {
    console.error("getMyRecords 호출 실패: studentID가 없습니다.");
    return [];
  }
    const scoresRef = collection(db, "scores");
    const q = query(
      scoresRef, 
      where("studentId", "==", studentId), 
      orderBy("timestamp", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      time: doc.data().timestamp?.toDate().toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, hourCycle: 'h23'
      })
    }));
  } catch (err) {
    console.error("데이터 로드 실패:", err);
    return [];
  }
};

// 4. 점수 및 이미지 업로드
export const uploadScore = async (scoreData, imageBase64) => {
  let imageUrl = "";

  if (imageBase64) {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ 
        action: "uploadImage", 
        image: imageBase64,
        studentId: scoreData.studentId 
      })
    });
    const result = await res.json();
    imageUrl = result.imageUrl;
  }

  await addDoc(collection(db, "scores"), {
    ...scoreData,
    imageUrl,
    timestamp: new Date() 
  });
};

export const getRankings = async (gameName) => {
  try {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, where("game", "==", gameName), orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);
    
    const bestMap = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!bestMap[data.nickname] || bestMap[data.nickname].score < data.score) {
        bestMap[data.nickname] = data;
      }
    });

    return Object.values(bestMap).sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Ranking fetch error:", error);
    return [];
  }
};

//루미큐브
/**
 * 1. 루미큐브 전체 참가자 명단 가져오기
 * 관리자 페이지(학과별 탭) 및 홈 화면의 학과별 참가자 수 카운트에 사용됩니다.
 */
export const getRummikubPlayers = async () => {
    try {
        const q = query(collection(db, "rummikubPlayers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // 각 문서의 id와 데이터를 묶어서 배열로 반환
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (err) {
        console.error("루미큐브 참가자 명단 로드 실패:", err);
        throw err;
    }
};

/**
 * 2. 루미큐브 신규 참가자 추가하기
 * 관리자가 직접 닉네임과 학과를 지정하여 참가자를 등록합니다.
 */
export const addRummikubPlayer = async (playerData) => {
    try {
        // playerData 예시: { nickname: "김이화", department: "컴퓨터공학과" }
        const docRef = await addDoc(collection(db, "rummikubPlayers"), {
            ...playerData,
            createdAt: serverTimestamp() // 파이어베이스 서버 시간 기준 등록
        });
        return docRef.id;
    } catch (err) {
        console.error("루미큐브 참가자 등록 실패:", err);
        throw err;
    }
};

/**
 * 3. 루미큐브 조별 경기 점수 입력(업로드)하기
 * 관리자가 조를 선택하고 4명의 점수 및 불참 여부를 한 번에 저장합니다.
 */
export const uploadRummikubScores = async (scoreData) => {
    try {
        /*
          scoreData 예시:
          {
            gameGroup: "1일차 2게임 - B조",
            players: [
              { nickname: "김이화", department: "컴퓨터공학과", score: 80, isAttended: true },
              { nickname: "이컴공", department: "컴퓨터공학과", score: 0, isAttended: false }, // 불참
              ... 총 4명
            ]
          }
        */
        const docRef = await addDoc(collection(db, "rummikubScores"), {
            ...scoreData,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (err) {
        console.error("루미큐브 점수 데이터 업로드 실패:", err);
        throw err;
    }
};

/**
 * 4. 저장된 모든 루미큐브 경기 결과 점수 가져오기
 * 홈 화면에서 개인 실시간 랭킹 및 학과별 평균 점수 랭킹을 정렬할 때 사용됩니다.
 */
export const getRummikubScores = async () => {
    try {
        const q = query(collection(db, "rummikubScores"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (err) {
        console.error("루미큐브 경기 점수 로드 실패:", err);
        throw err;
    }
};

// 1. 응원 메시지 등록하기
export const uploadCheerMessage = async (department, message) => {
  try {
    await addDoc(collection(db, "rummikubCheers"), {
      department,
      message,
      timestamp: serverTimestamp() // 최신순 정렬을 위한 시간 기록
    });
    return { success: true };
  } catch (err) {
    throw new Error(err.message);
  }
};

// 2. 응원 메시지 전체 가져오기
export const getCheerMessages = async () => {
  try {
    const q = query(collection(db, "rummikubCheers"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    throw new Error(err.message);
  }
};