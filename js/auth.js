// ==========================================
// EduLand — Authentication Manager
// ==========================================

const AUTH_KEY = "eduland_users";
const CURRENT_USER_KEY = "eduland_current";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUsers(u) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  } catch (e) {}
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function setCurrentUser(u) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
  } catch (e) {}
}

function registerUser(name, email, password) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return { ok: false, msg: "Email này đã được đăng ký trước đó!" };
  }
  const user = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    joined: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { ok: true, msg: "Đăng ký tài khoản thành công!" };
}

function loginUser(email, password) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail && u.password === password
  );
  if (!user) {
    return { ok: false, msg: "Email hoặc mật khẩu không chính xác!" };
  }
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { ok: true, msg: "Đăng nhập thành công! Chào mừng bạn trở lại." };
}

function logoutUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (e) {}
  showToast("Bạn đã đăng xuất thành công!", "info");
  setTimeout(() => location.reload(), 600);
}

function renderAuthNav() {
  const user = getCurrentUser();
  const area = document.getElementById("authArea");
  if (!area) return;

  if (user) {
    const lastName = user.name ? user.name.split(" ").pop() : "User";
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
    area.innerHTML = `
      <div class="user-chip" title="${user.email}">
        <span class="avatar">${initial}</span>
        <span class="d-none d-sm-inline">${lastName}</span>
      </div>
      <button class="nav-icon-btn" onclick="logoutUser()" title="Đăng xuất" aria-label="Đăng xuất">
        <i class="bi bi-box-arrow-right"></i>
      </button>`;
  } else {
    const loginUrl = getHtmlPath("login.html");
    area.innerHTML = `
      <a href="${loginUrl}" class="btn-edu auth-login-btn" title="Đăng nhập">
        <i class="bi bi-person"></i><span class="auth-btn-text"> Đăng nhập</span>
      </a>`;
  }
}
