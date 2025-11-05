import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBImV4-QroenwecFE2Nk53MeJGQt-aWE2o",
  authDomain: "studio-1263535307-205e6.firebaseapp.com",
  databaseURL: "https://studio-1263535307-205e6-default-rtdb.firebaseio.com",
  projectId: "studio-1263535307-205e6",
  storageBucket: "studio-1263535307-205e6.firebasestorage.app",
  messagingSenderId: "240447378915",
  appId: "1:240447378915:web:a69dc620dab3158851fcd6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

