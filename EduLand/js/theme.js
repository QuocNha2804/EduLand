(function () {
  const saved = localStorage.getItem("eduland_theme");
  if (saved === "dark") document.body.classList.add("dark");
})();

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("eduland_theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const isDark = document.body.classList.contains("dark");
  btn.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-stars-fill"></i>';
}

document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcon();
  const btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);
});
