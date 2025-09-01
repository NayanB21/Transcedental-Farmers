// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4SGHMD8ONF4muhzBx2Th-GbcdJT-E9HE",
  authDomain: "agritechapp-8c450.firebaseapp.com",
  projectId: "agritechapp-8c450",
  storageBucket: "agritechapp-8c450.firebasestorage.app",
  messagingSenderId: "1032477660434",
  appId: "1:1032477660434:web:1b1a228ec87201f3a28fcb",
  measurementId: "G-YVRTGM56VN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database reference
export const db = getFirestore(app);
