let currentPage = 1;
const PER_PAGE = 6;
let filteredCourses = [...COURSES];

function applyFilters() {
  const cats = [...document.querySelectorAll(".filter-cat:checked")].map(
    (e) => e.value,
  );
  const levels = [...document.querySelectorAll(".filter-level:checked")].map(
    (e) => e.value,
  );
  const price = document.querySelector(".filter-price:checked")?.value || "all";
  const rating = parseFloat(
    document.querySelector(".filter-rating:checked")?.value || "0",
  );
  const q = (document.getElementById("realtimeSearch")?.value || "")
    .toLowerCase()
    .trim();

  filteredCourses = COURSES.filter((c) => {
    if (cats.length && !cats.includes(c.category)) return false;
    if (levels.length && !levels.includes(c.level)) return false;
    if (rating > 0 && c.rating < rating) return false;
    if (price === "under-1" && c.price >= 1000000) return false;
    if (price === "1-15" && (c.price < 1000000 || c.price > 1500000))
      return false;
    if (price === "over-15" && c.price <= 1500000) return false;
    if (
      q &&
      !c.title.toLowerCase().includes(q) &&
      !c.instructor.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  applySort();
  currentPage = 1;
  renderCourses();
}

function applySort() {
  const sort = document.getElementById("sortSelect")?.value || "newest";
  if (sort === "price-asc") filteredCourses.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc")
    filteredCourses.sort((a, b) => b.price - a.price);
  else if (sort === "rating")
    filteredCourses.sort((a, b) => b.rating - a.rating);
  else filteredCourses.sort((a, b) => b.id - a.id);
}

function renderCourses() {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filteredCourses.slice(start, start + PER_PAGE);

  if (pageItems.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><i class="bi bi-search" style="font-size:3rem;color:var(--text-muted)"></i><p class="mt-3 text-muted">Không tìm thấy khóa học phù hợp</p></div>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  grid.innerHTML = pageItems
    .map((c) => `<div class="col-md-6">${courseCardHTML(c)}</div>`)
    .join("");
  renderPagination();
}

function renderPagination() {
  const total = Math.ceil(filteredCourses.length / PER_PAGE);
  const pag = document.getElementById("pagination");
  if (!pag) return;
  pag.innerHTML = Array.from(
    { length: total },
    (_, i) =>
      `<button class="${i + 1 === currentPage ? "active" : ""}" onclick="goPage(${i + 1})">${i + 1}</button>`,
  ).join("");
}

function goPage(p) {
  currentPage = p;
  renderCourses();
  window.scrollTo({ top: 300, behavior: "smooth" });
}

function resetFilters() {
  document
    .querySelectorAll(".filter-cat, .filter-level")
    .forEach((e) => (e.checked = false));
  document.querySelector(".filter-price[value='all']").checked = true;
  document.querySelector(".filter-rating[value='0']").checked = true;
  document.getElementById("realtimeSearch").value = "";
  document.getElementById("sortSelect").value = "newest";
  applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("courseGrid")) return;
  // URL query
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if (q) document.getElementById("realtimeSearch").value = q;

  document
    .querySelectorAll(
      ".filter-cat, .filter-level, .filter-price, .filter-rating",
    )
    .forEach((el) => {
      el.addEventListener("change", applyFilters);
    });
  document
    .getElementById("realtimeSearch")
    ?.addEventListener("input", applyFilters);
  document.getElementById("sortSelect")?.addEventListener("change", () => {
    applySort();
    renderCourses();
  });

  applyFilters();
});
