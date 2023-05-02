import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3pUlSuLkdoeauC0HAK54zNFYMCUv23Mg",
  authDomain: "smart-cradle-1b9d9.firebaseapp.com",
  databaseURL:
    "https://smart-cradle-1b9d9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-cradle-1b9d9",
  storageBucket: "smart-cradle-1b9d9.appspot.com",
  messagingSenderId: "885747873049",
  appId: "1:885747873049:web:3cf848063b0c6067918188",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const RTDB = getDatabase(app);
