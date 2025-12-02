// =============================
// auth.js — client-side auth with hashing, validation, sessions, per-user storage
// =============================

// Storage keys
const USERS_KEY = "ooz_users";                 // [{id, username, email, passHash, createdAt}]
const SESSION_KEY = "ooz_session";             // { userId, token, remember, createdAt }
const LOGIN_ATTEMPTS_KEY = "ooz_login_attempts"; // { email: { count, lastAttempt } }
const SALT = "ooz_local_salt_v1";              // demo salt (use per-user random salt on backend in real apps)

// --- Crypto (SHA-256 using SubtleCrypto) ---
async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, email) {
  // Combine with email + demo salt; in a real app use per-user random salt and server-side hashing
  return sha256(`${SALT}::${email}::${password}`);
}

// --- Validation ---
function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// Strong password: min 8 chars, at least 1 letter and 1 digit.
// Fixed regex with properly escaped special chars (no errors).
function isStrongPassword(str) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(str);
}


  

function sanitize(str) { return String(str).trim(); }

// --- LocalStorage helpers ---
function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function getLoginAttempts() { return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY)) || {}; }
function saveLoginAttempts(obj) { localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(obj)); }

// --- Sessions ---
function getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
function saveSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

// --- Token ---
function genToken() {
  const rand = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(rand).map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- Rate-limit login attempts per email ---
function canAttempt(email) {
  const attempts = getLoginAttempts();
  const rec = attempts[email] || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  // Reset window after 10 minutes
  if (now - rec.lastAttempt > 10 * 60 * 1000) { rec.count = 0; }
  const allowed = rec.count < 5;
  return { allowed, rec, attempts, now };
}
function recordAttempt(email, rec, attempts, now) {
  rec.count += 1; rec.lastAttempt = now;
  attempts[email] = rec;
  saveLoginAttempts(attempts);
}

// --- User lookup ---
function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// --- Per-user storage namespace (for app.js to use) ---
function userKey(userId, base) { return `ooz_${userId}_${base}`; }

window.OOZUserStore = {
  get(userId, key, fallback = null) {
    const raw = localStorage.getItem(userKey(userId, key));
    return raw ? JSON.parse(raw) : fallback;
  },
  set(userId, key, value) {
    localStorage.setItem(userKey(userId, key), JSON.stringify(value));
  },
  remove(userId, key) {
    localStorage.removeItem(userKey(userId, key));
  }
};

// --- Sign up ---
async function handleSignup(e) {
  e.preventDefault();
  const username = sanitize(document.getElementById("signup-username").value);
  const email = sanitize(document.getElementById("signup-email").value);
  const password = document.getElementById("signup-password").value;
  const remember = document.getElementById("signup-remember").checked;

  if (!username || username.length < 2) return alert("Please enter a valid username.");
  if (!isEmail(email)) return alert("Please enter a valid email.");
  if (!isStrongPassword(password)) return alert("Password must be at least 8 chars with letters and numbers.");

  const existing = findUserByEmail(email);
  if (existing) return alert("A user with this email already exists.");

  const passHash = await hashPassword(password, email);
  const users = getUsers();
  const userId = `u_${Date.now()}`;
  users.push({ id: userId, username, email, passHash, createdAt: new Date().toISOString() });
  saveUsers(users);

  // Initialize per-user data
  OOZUserStore.set(userId, "habits", []);
  OOZUserStore.set(userId, "tasks", []);

  // Set session
  const token = genToken();
  saveSession({ userId, token, remember, createdAt: Date.now() });

  alert("Registration successful!");
  location.href = "index.html";
}

// --- Login ---
async function handleLogin(e) {
  e.preventDefault();
  const email = sanitize(document.getElementById("login-email").value);
  const password = document.getElementById("login-password").value;
  const remember = document.getElementById("login-remember").checked;

  const { allowed, rec, attempts, now } = canAttempt(email);
  if (!allowed) return alert("Too many attempts. Please try again in 10 minutes.");

  if (!isEmail(email)) return alert("Please enter a valid email.");
  const user = findUserByEmail(email);
  if (!user) { recordAttempt(email, rec, attempts, now); return alert("Invalid credentials."); }

  const passHash = await hashPassword(password, email);
  if (passHash !== user.passHash) { recordAttempt(email, rec, attempts, now); return alert("Invalid credentials."); }

  const token = genToken();
  saveSession({ userId: user.id, token, remember, createdAt: Date.now() });
  alert("Login successful!");
  location.href = "index.html";
}

// --- Guards ---
function guardAuthPages() {
  const session = getSession();
  if (!session) return;
  if (session.remember && session.userId) {
    if (location.pathname.endsWith("login.html") || location.pathname.endsWith("signup.html")) {
      location.href = "index.html";
    }
  }
}
function guardProtectedPages() {
  const isAuthPage = location.pathname.endsWith("login.html") || location.pathname.endsWith("signup.html");
  if (isAuthPage) return;
  const session = getSession();
  if (!session || !session.userId) {
    location.href = "login.html";
  }
}

// --- Logout ---
function logout() {
  clearSession();
  location.href = "login.html";
}
window.oozLogout = logout;

// --- Attach handlers and run guards ---
window.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (signupForm) signupForm.addEventListener("submit", (e) => { handleSignup(e); });
  if (loginForm) loginForm.addEventListener("submit", (e) => { handleLogin(e); });

  guardAuthPages();
  guardProtectedPages();
});

// --- Expose current user helpers for app.js ---
window.OOZAuth = {
  getSession,
  getCurrentUserId() { const s = getSession(); return s?.userId || null; },
  getCurrentUser() {
    const s = getSession(); if (!s?.userId) return null;
    const u = getUsers().find(x => x.id === s.userId);
    return u || null;
  }
};
