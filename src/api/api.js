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
  orderBy 
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

  return { success: true, user: userSnap.data() };
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