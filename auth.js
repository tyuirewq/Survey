import { auth } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupEmail.value;
  const pass = signupPassword.value;
  const confirm = confirmPassword.value;
  if (pass !== confirm) return alert("Passwords do not match");
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Signup successful!");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
});
