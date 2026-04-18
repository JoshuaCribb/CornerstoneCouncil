const PASSWORD = "foundation2026";
const SESSION_KEY = "agentAuth";
const TIME_KEY = "agentLastActivity";
const TIMEOUT = 30 * 60 * 1000;

function isAuthenticated() {
  const auth = sessionStorage.getItem(SESSION_KEY);
  const last = sessionStorage.getItem(TIME_KEY);
  if (!auth || !last) return false;
  return (Date.now() - parseInt(last)) < TIMEOUT;
}

function updateActivity() {
  sessionStorage.setItem(TIME_KEY, Date.now());
}

function login(password) {
  if (password === PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    updateActivity();
    hideLogin();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function hideLogin() {
  document.getElementById("loginScreen").style.display = "none";
  document.body.classList.remove("locked");
}

function showLogin() {
  document.getElementById("loginScreen").style.display = "flex";
  document.body.classList.add("locked");
}

function requireAuth() {
  if (isAuthenticated()) {
    hideLogin();
  } else {
    showLogin();
  }
}

["click","mousemove","keydown","scroll","touchstart"].forEach(evt => {
  document.addEventListener(evt, updateActivity);
});

setInterval(() => {
  if (isAuthenticated()) {
    const last = parseInt(sessionStorage.getItem(TIME_KEY));
    if (Date.now() - last > TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TIME_KEY);
      showLogin();
    }
  }
}, 60000);

function submitPassword() {
  const input = document.getElementById("passwordInput").value;
  login(input);
}

window.onload = function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const input = document.getElementById("passwordInput");
  if (input) input.value = "";

  requireAuth();
};