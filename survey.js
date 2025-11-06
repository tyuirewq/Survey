// import { auth, db, ref, set, get, onAuthStateChanged, push } from './firebase.js';

// let currentUser = null;
// let otpCode = "";

// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//     alert("Please log in to access the survey.");
//     window.location.href = "login.html";
//   } else {
//     currentUser = user;
//   }
// });

// window.sendOTP = async function () {
//   const email = document.getElementById('userEmail').value.trim();
//   if (!email) return alert("Enter a valid email");

//   // Generate secure 6-digit OTP
//   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//   // Save OTP to Firebase
//   await set(ref(db, 'otp/' + email.replace(/\W/g, '')), {
//     code: otpCode,
//     timestamp: Date.now()
//   });

//   // Send OTP via email using Apps Script
//   sendOtpEmail(email, otpCode);

//   alert("OTP has been sent to your email.");
// };

// // Email sending function via Google Apps Script
// function sendOtpEmail(email, otp) {
//   const formData = new URLSearchParams();
//   formData.append("email", email);
//   formData.append("otp", otp);

//   fetch("https://script.google.com/macros/s/AKfycbxI84TuS41YTQE3KcWCe4tjVsRKtSsw6Q_l8xvGA_0Iv0ySHnpew3Im7P6YYNiwld_jgw/exec", {
//     method: "POST",
//     body: formData
//   })
//   .then(res => res.text())
//   .then(console.log)
//   .catch(console.error);
// }

// document.getElementById('surveyForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const email = document.getElementById('userEmail').value.trim();
//   const otpInput = document.getElementById('userOTP').value.trim();
//   const otpRef = ref(db, 'otp/' + email.replace(/\W/g, ''));
//   const snapshot = await get(otpRef);

//   if (!snapshot.exists() || snapshot.val().code !== otpInput) {
//     alert("Invalid OTP");
//     return;
//   }

//   const formData = {
//     email: email,
//     ageGroup: e.target.ageGroup.value,
//     goal: e.target.goal.value,
//     type: e.target.type.value,
//     submittedAt: Date.now()
//   };

//   const safeEmailKey = email.replace(/\W/g, ''); // sanitize email for Firebase path
//   const responsesRef = ref(db, 'responses/' + safeEmailKey);
//   const newResponseRef = push(responsesRef); // requires push() to be imported
//   await set(newResponseRef, formData);

//   alert("Survey submitted successfully!");
//   e.target.reset();
// });

// import { db, ref, set, get, push } from './firebase.js';

// let otpCode = "";

// window.sendOTP = async function () {
//   const email = document.getElementById('userEmail').value.trim();
//   if (!email) return alert("Enter a valid email");

//   // Generate secure 6-digit OTP
//   otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//   // Save OTP to Firebase
//   await set(ref(db, 'otp/' + email.replace(/\W/g, '')), {
//     code: otpCode,
//     timestamp: Date.now()
//   });

//   // Send OTP via email using Apps Script
//   sendOtpEmail(email, otpCode);

//   alert("OTP has been sent to your email.");
// };

// function sendOtpEmail(email, otp) {
//   const formData = new URLSearchParams();
//   formData.append("email", email);
//   formData.append("otp", otp);

//   fetch("https://script.google.com/macros/s/AKfycbxI84TuS41YTQE3KcWCe4tjVsRKtSsw6Q_l8xvGA_0Iv0ySHnpew3Im7P6YYNiwld_jgw/exec", {
//     method: "POST",
//     body: formData
//   })
//   .then(res => res.text())
//   .then(console.log)
//   .catch(console.error);
// }

// document.getElementById('surveyForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const email = document.getElementById('userEmail').value.trim();
//   const otpInput = document.getElementById('userOTP').value.trim();
//   const safeEmailKey = email.replace(/\W/g, '');
//   const otpRef = ref(db, 'otp/' + safeEmailKey);
//   const snapshot = await get(otpRef);

//   if (!snapshot.exists()) {
//     alert("OTP not found. Please request a new one.");
//     return;
//   }

//   const { code, timestamp } = snapshot.val();
//   const now = Date.now();
//   const tenMinutes = 10 * 60 * 1000;

//   if (code !== otpInput) {
//     alert("Invalid OTP");
//     return;
//   }

//   if (now - timestamp > tenMinutes) {
//     alert("OTP expired. Please request a new one.");
//     return;
//   }

//   const formData = {
//     email: email,
//     ageGroup: e.target.ageGroup.value,
//     goal: e.target.goal.value,
//     type: e.target.type.value,
//     submittedAt: now
//   };

//   const responsesRef = ref(db, 'responses/' + safeEmailKey);
//   const newResponseRef = push(responsesRef);
//   await set(newResponseRef, formData);

//   alert("Survey submitted successfully!");
//   e.target.reset();
// });


// =======================
// IMPORT FIREBASE MODULES
// =======================
import { db, ref, set, get, push } from './firebase.js';

let otpCode = "";
let timerInterval = null;

// ===============
// SEND OTP EMAIL
// ===============
window.sendOTP = async function () {
  const email = document.getElementById('userEmail').value.trim();
  if (!email) return alert("Enter a valid email");

  // Generate secure 6-digit OTP
  otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to Firebase
  await set(ref(db, 'otp/' + email.replace(/\W/g, '')), {
    code: otpCode,
    timestamp: Date.now()
  });

  // Send OTP via Google Apps Script
  sendOtpEmail(email, otpCode);

  alert("OTP sent!");

  startOTPTimer();
};

// ===========================
// SEND EMAIL THROUGH APPS SCRIPT
// ===========================
function sendOtpEmail(email, otp) {
  const data = new URLSearchParams();
  data.append("email", email);
  data.append("otp", otp);

  fetch("https://script.google.com/macros/s/AKfycbxI84TuS41YTQE3KcWCe4tjVsRKtSsw6Q_l8xvGA_0Iv0ySHnpew3Im7P6YYNiwld_jgw/exec", {
    method: "POST",
    body: data
  })
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
}

// =======================
// OTP TIMER + RESEND LOGIC
// =======================
function startOTPTimer() {
  let timeLeft = 30; // seconds
  const timerLabel = document.getElementById("otpTimer");
  const resendBtn = document.getElementById("resendOTP");

  resendBtn.disabled = true;
  resendBtn.classList.remove("text-blue-600");
  resendBtn.classList.add("text-gray-400");

  timerLabel.innerText = `Wait ${timeLeft}s`;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerLabel.innerText = `Wait ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerLabel.innerText = "";
      resendBtn.disabled = false;
      resendBtn.classList.add("text-blue-600");
      resendBtn.classList.remove("text-gray-400");
    }
  }, 1000);
}

// =======================
// VERIFY & SUBMIT SURVEY
// =======================
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('userEmail').value.trim();
  const otpInput = document.getElementById('userOTP').value.trim();
  const safeEmailKey = email.replace(/\W/g, '');

  // Fetch OTP from Firebase
  const otpRef = ref(db, 'otp/' + safeEmailKey);
  const snapshot = await get(otpRef);

  if (!snapshot.exists()) {
    alert("OTP not found. Request a new one.");
    return;
  }

  const { code, timestamp } = snapshot.val();
  const now = Date.now();
  const expiry = 10 * 60 * 1000; // 10 mins

  if (otpInput !== code) {
    alert("Incorrect OTP.");
    return;
  }

  if (now - timestamp > expiry) {
    alert("OTP expired. Request a new one.");
    return;
  }

  // =============================
  // ✅ COLLECT ALL FORM FIELDS
  // =============================
  const formData = {
    name: e.target.name.value,
    dob: e.target.dob.value,
    address: e.target.address.value,
    occupation: e.target.occupation.value,

    // --- First Section ---
    educationSaving: e.target.educationSaving.value,
    class12Expense: e.target.class12Expense.value,
    age18Expense: e.target.age18Expense.value,
    marriageExpense: e.target.marriageExpense.value,
    parentIncomeSupport: e.target.parentIncomeSupport.value,
    accidentSupport: e.target.accidentSupport.value,

    // --- Second Section ---
    pensionPlanning: e.target.pensionPlanning.value,
    dependents: e.target.dependents.value,
    dependentsWork: e.target.dependentsWork.value,
    selfSupport: e.target.selfSupport.value,
    retirementSupport: e.target.retirementSupport.value,
    retirementAge: e.target.retirementAge.value,
    monthlyPension: e.target.monthlyPension.value,

    // Email + Timestamp
    email: email,
    submittedAt: now
  };

  // Save to Firebase
  const responsesRef = ref(db, 'responses/' + safeEmailKey);
  const newEntry = push(responsesRef);
  await set(newEntry, formData);

  alert("✅ Survey submitted successfully!");

  e.target.reset();
});

