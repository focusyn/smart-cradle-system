import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXHDKTbbanjpOn-SyZmVvz40rw3Ucq4mA",
  authDomain: "smart-cradle-7a72f.firebaseapp.com",
  databaseURL: "https://smart-cradle-7a72f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-cradle-7a72f",
  storageBucket: "smart-cradle-7a72f.appspot.com",
  messagingSenderId: "269372880664",
  appId: "1:269372880664:web:f0a33d2bf33736c093106d",
  measurementId: "G-03KYC8TFY5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const RTDB = getDatabase(app);
