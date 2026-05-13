import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo8RrdKBwEQq9RRYmUE_Y1ZWb4KZvNF4I",
  authDomain: "ai-esports-contest.firebaseapp.com",
  projectId: "ai-esports-contest",
  storageBucket: "ai-esports-contest.firebasestorage.app",
  messagingSenderId: "1049328594591",
  appId: "1:1049328594591:web:a55ae34350904d7b5c7caa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);