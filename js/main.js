// ==========================================
// EduLand — Core Script & Utilities
// ==========================================

// ============ PATH HELPERS ============
function isInsideHtml() {
  const p = window.location.pathname.replace(/\\/g, "/");
  return p.includes("/html/") || p.endsWith("/html") || p.endsWith("/html/");
}

function getHtmlPath(filename) {
  return isInsideHtml() ? filename : `html/${filename}`;
}

function getRootPath(filename = "index.html") {
  return isInsideHtml() ? `../${filename}` : filename;
}

function fmt(n) {
  return Number(n || 0).toLocaleString("vi-VN") + "đ";
}

// ============ TOAST NOTIFICATION ============
function showToast(msg, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    info: "bi-info-circle-fill",
    warning: "bi-exclamation-triangle-fill",
  };
  const t = document.createElement("div");
  t.className = `toast-edu ${type}`;
  t.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(120%)";
    t.style.transition = "all .35s ease";
  }, 2600);
  setTimeout(() => {
    if (t.parentNode) t.remove();
  }, 3000);
}

// ============ PRELOADER ============
function hidePreloader() {
  const pl = document.getElementById("preloader");
  if (pl && !pl.classList.contains("hide")) {
    pl.classList.add("hide");
    setTimeout(() => {
      if (pl.parentNode) pl.remove();
    }, 500);
  }
}
window.addEventListener("load", () => {
  setTimeout(hidePreloader, 250);
});
// Fallback in case window.load is delayed
setTimeout(hidePreloader, 1500);

// ============ NAVBAR SCROLL & BACK TO TOP ============
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar-edu");
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  const btt = document.getElementById("backToTop");
  if (btt) btt.classList.toggle("show", window.scrollY > 350);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (el.dataset.done) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      el.dataset.done = "1";
      const target = +el.dataset.count;
      let n = 0;
      const step = Math.max(1, target / 50);
      const timer = setInterval(() => {
        n += step;
        if (n >= target) {
          n = target;
          clearInterval(timer);
        }
        el.textContent =
          Math.floor(n).toLocaleString("vi-VN") + (el.dataset.suffix || "");
      }, 20);
    }
  });
}
window.addEventListener("scroll", animateCounters);
window.addEventListener("DOMContentLoaded", animateCounters);

// ============ NEWSLETTER ============
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById("newsletterEmail");
  if (!input) return;
  const email = input.value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    showToast("Vui lòng nhập địa chỉ email hợp lệ!", "error");
    return;
  }
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem("eduland_newsletter") || "[]");
  } catch (err) {}
  if (list.includes(email)) {
    showToast("Email này đã đăng ký nhận tin trước đó!", "info");
    return;
  }
  list.push(email);
  try {
    localStorage.setItem("eduland_newsletter", JSON.stringify(list));
  } catch (err) {}
  input.value = "";
  showToast("Đăng ký nhận tin thành công! Cảm ơn bạn.", "success");
}

// ============ SEARCH HANDLER ============
function performGlobalSearch() {
  const searchInput = document.getElementById("searchInput");
  const q = searchInput?.value.trim();
  if (q) {
    location.href = `${getHtmlPath("courses.html")}?q=${encodeURIComponent(q)}`;
  }
}

// ============ DOM INITIALIZATION ============
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Hamburger Menu
  const ham = document.getElementById("hamburger");
  const links = document.querySelector(".nav-links");
  if (ham && links) {
    ham.addEventListener("click", (e) => {
      e.stopPropagation();
      links.classList.toggle("mobile-open");
    });
    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!links.contains(e.target) && !ham.contains(e.target)) {
        links.classList.remove("mobile-open");
      }
    });
    // Close when clicking nav links
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("mobile-open");
      });
    });

    // Inject mobile search bar inside drawer if not present
    if (!links.querySelector(".mobile-drawer-search")) {
      const searchLi = document.createElement("li");
      searchLi.className = "mobile-drawer-search d-lg-none my-2";
      searchLi.innerHTML = `
        <div class="search-box w-100" style="display:flex !important">
          <input type="text" class="mobile-search-input" placeholder="Tìm kiếm khóa học..." style="width:100%" />
          <button class="mobile-search-btn" aria-label="Tìm kiếm"><i class="bi bi-search"></i></button>
        </div>`;
      links.insertBefore(searchLi, links.firstChild);

      const mBtn = searchLi.querySelector(".mobile-search-btn");
      const mInput = searchLi.querySelector(".mobile-search-input");
      const doSearch = () => {
        const q = mInput?.value.trim();
        if (q) location.href = `${getHtmlPath("courses.html")}?q=${encodeURIComponent(q)}`;
      };
      if (mBtn) mBtn.addEventListener("click", doSearch);
      if (mInput) {
        mInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
          }
        });
      }
    }
  }

  // Back to top
  const btt = document.getElementById("backToTop");
  if (btt) {
    btt.addEventListener("click", scrollToTop);
  }

  // Navbar Search
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", performGlobalSearch);
  }
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performGlobalSearch();
      }
    });
  }
});

// ============ RENDER COURSE CARD ============
function courseCardHTML(c, showAddBtn = true) {
  const levelBadge = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced",
  }[c.level] || "badge-beginner";

  const detailUrl = `${getHtmlPath("course-detail.html")}?id=${c.id}`;

  return `
    <div class="course-card" data-aos="fade-up">
      <div class="course-thumb">
        <span class="course-level badge-level ${levelBadge}">${c.level}</span>
        <i class="bi ${c.icon}"></i>
      </div>
      <div class="course-body">
        <span class="course-cat">${c.category}</span>
        <h5 class="course-title"><a href="${detailUrl}">${c.title}</a></h5>
        <div class="course-instructor"><i class="bi bi-person-circle"></i> ${c.instructor}</div>
        <div class="course-extra-meta d-flex align-items-center gap-3 text-muted mb-2" style="font-size:0.82rem">
          <span><i class="bi bi-clock"></i> ${c.duration}</span>
          <span><i class="bi bi-play-circle"></i> ${c.lessons} bài học</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="rating"><i class="bi bi-star-fill"></i> ${c.rating}</span>
          <small class="text-muted">(${c.reviews.toLocaleString("vi-VN")} đánh giá)</small>
        </div>
        <div class="course-meta">
          <div class="price">
            ${c.oldPrice ? `<span class="old">${fmt(c.oldPrice)}</span>` : ""}${fmt(c.price)}
          </div>
          ${showAddBtn ? `<button class="btn-edu" style="padding:8px 16px;font-size:0.85rem" onclick="addToCart(${c.id})"><i class="bi bi-cart-plus"></i> Thêm</button>` : ""}
        </div>
        <a href="${detailUrl}" class="mt-3 d-block text-center fw-semibold" style="font-size:0.88rem">Xem chi tiết →</a>
      </div>
    </div>`;
}

// ============ RENDER INSTRUCTOR CARD ============
function instructorCardHTML(i) {
  const detailUrl = `${getHtmlPath("instructor-detail.html")}?id=${i.id}`;
  return `
    <div class="instructor-card" data-aos="zoom-in">
      <div class="instructor-avatar">${i.name.split(" ").pop().charAt(0)}</div>
      <h4>${i.name}</h4>
      <div class="role">${i.role}</div>
      <div class="instructor-stats d-flex justify-content-center gap-3 my-2 text-muted" style="font-size:0.82rem">
        <span><strong class="text-primary">${i.courses}</strong> khóa</span>
        <span><strong class="text-primary">${(i.students || 0).toLocaleString("vi-VN")}</strong> học viên</span>
        <span><strong class="text-warning">★ ${i.rating}</strong></span>
      </div>
      <div class="socials">
        <a href="#" title="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" title="Twitter/X"><i class="bi bi-twitter-x"></i></a>
        <a href="#" title="LinkedIn"><i class="bi bi-linkedin"></i></a>
      </div>
      <a href="${detailUrl}" class="btn-edu-outline mt-3" style="padding:6px 18px;font-size:0.85rem">Xem chi tiết</a>
    </div>`;
}

// ============ RENDER BLOG CARD ============
function blogCardHTML(b) {
  const detailUrl = `${getHtmlPath("blog-detail.html")}?id=${b.id}`;
  return `
    <div class="blog-card" data-aos="fade-up">
      <div class="blog-thumb"><i class="bi ${b.icon}"></i></div>
      <div class="blog-body">
        <span class="blog-tag">${b.tag}</span>
        <h4><a href="${detailUrl}">${b.title}</a></h4>
        <p>${b.excerpt}</p>
        <div class="blog-meta">
          <span><i class="bi bi-person"></i> ${b.author}</span>
          <span><i class="bi bi-clock"></i> ${b.readTime}</span>
        </div>
        <a href="${detailUrl}" class="mt-2 fw-semibold" style="font-size:0.9rem">Đọc tiếp →</a>
      </div>
    </div>`;
}
