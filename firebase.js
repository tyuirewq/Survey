import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh09dzHrlEjm2TFkAy490Jdx8ay_KgI00",
  authDomain: "questionnaire-f0638.firebaseapp.com",
  databaseURL: "https://questionnaire-f0638-default-rtdb.firebaseio.com",
  projectId: "questionnaire-f0638",
  storageBucket: "questionnaire-f0638.firebasestorage.app",
  messagingSenderId: "869731192665",
  appId: "1:869731192665:web:209f53e0def000c6644648",
  measurementId: "G-P5JC47G3Z2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
