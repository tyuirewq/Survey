import { auth, db, ref, set, get, onAuthStateChanged } from './firebase.js';

let currentUser = null;
let otpCode = "";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please log in to access the survey.");
    window.location.href = "login.html";
  } else {
    currentUser = user;
  }
});

window.sendOTP = async function () {
  const email = document.getElementById('userEmail').value.trim();
  if (!email) return alert("Enter a valid email");

  otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await set(ref(db, 'otp/' + email.replace(/\W/g, '')), {
    code: otpCode,
    timestamp: Date.now()
  });

  alert("OTP sent: " + otpCode); // Replace with email service in production
};

document.getElementById('surveyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('userEmail').value.trim();
  const otpInput = document.getElementById('userOTP').value.trim();
  const otpRef = ref(db, 'otp/' + email.replace(/\W/g, ''));
  const snapshot = await get(otpRef);

  if (!snapshot.exists() || snapshot.val().code !== otpInput) {
    alert("Invalid OTP");
    return;
  }

  const formData = {
    uid: currentUser.uid,
    email: email,
    ageGroup: e.target.ageGroup.value,
    goal: e.target.goal.value,
    type: e.target.type.value,
    submittedAt: Date.now()
  };

  await set(ref(db, 'responses/' + currentUser.uid), formData);
  alert("Survey submitted successfully!");
  e.target.reset();
});
