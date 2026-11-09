// ==========================================
// EduLand — Theme Manager (Dark / Light Mode)
// ==========================================

// Apply theme immediately to documentElement and body to prevent flash
(function () {
  try {
    const saved = localStorage.getItem("eduland_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      if (document.body) {
        document.body.classList.add("dark");
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.classList.add("dark");
        });
      }
    }
  } catch (e) {
    console.error("Theme init error:", e);
  }
})();

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("dark", isDark);
  try {
    localStorage.setItem("eduland_theme", isDark ? "dark" : "light");
  } catch (e) {}
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const isDark =
    document.body.classList.contains("dark") ||
    document.documentElement.classList.contains("dark");
  btn.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-stars-fill"></i>';
  btn.setAttribute(
    "title",
    isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
  );
  btn.setAttribute("aria-label", isDark ? "Giao diện sáng" : "Giao diện tối");
}

document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcon();
  const btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);
});
