import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// auth.js
const statusBox = document.getElementById('statusBox');
const currentUserEl = document.getElementById('currentUser');

function showStatus(text, type = 'ok') {
  statusBox.style.display = 'block';
  statusBox.textContent = text;
  statusBox.className = 'status ' + (type === 'err' ? 'err' : 'ok');
  setTimeout(() => { statusBox.style.display = 'none'; }, 6000);
}

function updateCurrentUserUI(user) {
  if (!currentUserEl) return;
  currentUserEl.textContent = user
    ? `${user.email} (${user.uid.slice(0, 6)})`
    : 'Not signed in';
}

function showSignin() {
  tabSignin.classList.add('active');
  tabSignup.classList.remove('active');
  formSignin.style.display = '';
  formSignup.style.display = 'none';
  formForgot.style.display = 'none';
}

function showSignup() {
  tabSignup.classList.add('active');
  tabSignin.classList.remove('active');
  formSignup.style.display = '';
  formSignin.style.display = 'none';
  formForgot.style.display = 'none';
}

function showForgot() {
  tabSignin.classList.remove('active');
  tabSignup.classList.remove('active');
  formForgot.style.display = '';
  formSignin.style.display = 'none';
  formSignup.style.display = 'none';
}

tabSignin.onclick = showSignin;
tabSignup.onclick = showSignup;

async function signUp() {
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const password = document.getElementById('su-password').value;

  if (!name || !email || password.length < 6) {
    showStatus('Please enter valid name, email and a password with at least 6 characters', 'err');
    return;
  }

  try {
    const credential = await auth.createUserWithEmailAndPassword(email, password);
    const user = credential.user;
    await db.ref('users/' + user.uid).set({ name, email, createdAt: Date.now() });
    showStatus('Account created and profile saved. Signed in.', 'ok');
    updateCurrentUserUI(user);
    setTimeout(() => window.location.href = 'dashboard.html', 500);
  } catch (err) {
    showStatus('Sign up failed: ' + err.message, 'err');
  }
}

async function signIn() {
  const email = document.getElementById('si-email').value.trim();
  const password = document.getElementById('si-password').value;

  try {
    const credential = await auth.signInWithEmailAndPassword(email, password);
    const user = credential.user;
    showStatus('Signed in successfully. Redirecting...', 'ok');
    updateCurrentUserUI(user);
    setTimeout(() => window.location.href = 'dashboard.html', 500);
  } catch (err) {
    showStatus('Sign in failed: ' + err.message, 'err');
  }
}

async function sendReset() {
  const email = document.getElementById('fp-email').value.trim();
  if (!email) return showStatus('Enter your email address', 'err');

  try {
    await auth.sendPasswordResetEmail(email);
    showStatus('Password reset email sent. Check your inbox.', 'ok');
    showSignin();
  } catch (err) {
    showStatus('Reset failed: ' + err.message, 'err');
  }
}

async function signOut() {
  try {
    await auth.signOut();
    showStatus('Signed out', 'ok');
    updateCurrentUserUI(null);
  } catch (err) {
    showStatus('Sign out failed: ' + err.message, 'err');
  }
}

auth.onAuthStateChanged(async (user) => {
  updateCurrentUserUI(user);
  if (user && (location.pathname.includes('index.html') || location.pathname === '/')) {
    showStatus('Already signed in. Redirecting to dashboard...', 'ok');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
    return;
  }

  if (user) {
    const snapshot = await db.ref('users/' + user.uid).get();
    if (!snapshot.exists()) {
      await db.ref('users/' + user.uid).set({ email: user.email, createdAt: Date.now() });
    }
  }
});
