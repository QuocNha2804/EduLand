const AUTH_KEY = "eduland_users";
const CURRENT_USER_KEY = "eduland_current";

function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]");
}
function saveUsers(u) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
}
function setCurrentUser(u) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
}

function registerUser(name, email, password) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, msg: "Email đã được đăng ký!" };
  }
  const user = {
    id: Date.now(),
    name,
    email,
    password,
    joined: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { ok: true, msg: "Đăng ký thành công!" };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return { ok: false, msg: "Email hoặc mật khẩu không đúng!" };
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  return { ok: true, msg: "Đăng nhập thành công!" };
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  showToast("Đã đăng xuất!", "info");
  setTimeout(() => location.reload(), 700);
}

function renderAuthNav() {
  const user = getCurrentUser();
  const area = document.getElementById("authArea");
  if (!area) return;
  if (user) {
    area.innerHTML = `
      <div class="user-chip">
        <span class="avatar">${user.name.charAt(0).toUpperCase()}</span>
        <span class="d-none d-md-inline">${user.name.split(" ").pop()}</span>
      </div>
      <button class="nav-icon-btn" onclick="logoutUser()" title="Đăng xuất">
        <i class="bi bi-box-arrow-right"></i>
      </button>`;
  } else {
    area.innerHTML = `<a href="login.html" class="btn-edu"><i class="bi bi-person"></i> Đăng nhập</a>`;
  }
}
