// ==========================================
// EduLand — Courses Catalog & Filter Engine
// ==========================================

let currentPage = 1;
const PER_PAGE = 6;
let filteredCourses = [...COURSES];

function applyFilters() {
  const cats = [...document.querySelectorAll(".filter-cat:checked")].map(
    (e) => e.value
  );
  const levels = [...document.querySelectorAll(".filter-level:checked")].map(
    (e) => e.value
  );
  const price = document.querySelector(".filter-price:checked")?.value || "all";
  const rating = parseFloat(
    document.querySelector(".filter-rating:checked")?.value || "0"
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
      !c.instructor.toLowerCase().includes(q) &&
      !c.category.toLowerCase().includes(q)
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
  if (sort === "price-asc") {
    filteredCourses.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredCourses.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredCourses.sort((a, b) => b.rating - a.rating);
  } else {
    // Newest / default by ID descending
    filteredCourses.sort((a, b) => b.id - a.id);
  }
}

function renderCourses() {
  const grid = document.getElementById("courseGrid");
  const countEl = document.getElementById("courseCount");
  if (!grid) return;

  if (countEl) {
    countEl.innerHTML = `Tìm thấy <strong>${filteredCourses.length}</strong> khóa học phù hợp`;
  }

  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filteredCourses.slice(start, start + PER_PAGE);

  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search" style="font-size:3.5rem;color:var(--text-muted)"></i>
        <h4 class="mt-3">Không tìm thấy khóa học phù hợp</h4>
        <p class="text-muted">Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc để xem tất cả.</p>
        <button class="btn-edu-outline mt-2" onclick="resetFilters()">
          <i class="bi bi-arrow-clockwise"></i> Xóa bộ lọc
        </button>
      </div>`;
    const pag = document.getElementById("pagination");
    if (pag) pag.innerHTML = "";
    return;
  }

  grid.innerHTML = pageItems
    .map((c) => `<div class="col-md-6">${courseCardHTML(c)}</div>`)
    .join("");

  renderPagination();

  // Re-init AOS if available
  if (window.AOS) {
    AOS.refresh();
  }
}

function renderPagination() {
  const total = Math.ceil(filteredCourses.length / PER_PAGE);
  const pag = document.getElementById("pagination");
  if (!pag) return;

  if (total <= 1) {
    pag.innerHTML = "";
    return;
  }

  let html = "";
  if (currentPage > 1) {
    html += `<button onclick="goPage(${currentPage - 1})" title="Trang trước"><i class="bi bi-chevron-left"></i></button>`;
  }

  for (let i = 1; i <= total; i++) {
    html += `<button class="${i === currentPage ? "active" : ""}" onclick="goPage(${i})">${i}</button>`;
  }

  if (currentPage < total) {
    html += `<button onclick="goPage(${currentPage + 1})" title="Trang sau"><i class="bi bi-chevron-right"></i></button>`;
  }

  pag.innerHTML = html;
}

function goPage(p) {
  currentPage = p;
  renderCourses();
  const target = document.getElementById("courseGrid");
  if (target) {
    const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function resetFilters() {
  document
    .querySelectorAll(".filter-cat, .filter-level")
    .forEach((e) => (e.checked = false));
  const priceAll = document.querySelector(".filter-price[value='all']");
  if (priceAll) priceAll.checked = true;
  const ratingAll = document.querySelector(".filter-rating[value='0']");
  if (ratingAll) ratingAll.checked = true;
  const searchInput = document.getElementById("realtimeSearch");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "newest";

  applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("courseGrid")) return;

  // URL query search parameter
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if (q) {
    const input = document.getElementById("realtimeSearch");
    if (input) input.value = q;
  }

  // Filter change listeners
  document
    .querySelectorAll(
      ".filter-cat, .filter-level, .filter-price, .filter-rating"
    )
    .forEach((el) => {
      el.addEventListener("change", applyFilters);
    });

  // Realtime search
  document
    .getElementById("realtimeSearch")
    ?.addEventListener("input", applyFilters);

  // Sorting change
  document.getElementById("sortSelect")?.addEventListener("change", () => {
    currentPage = 1;
    applySort();
    renderCourses();
  });

  applyFilters();
});
