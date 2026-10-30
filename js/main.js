// ============ TOAST ============
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
  };
  const t = document.createElement("div");
  t.className = `toast-edu ${type}`;
  t.innerHTML = `<i class="bi ${icons[type]}"></i><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(120%)";
    t.style.transition = "all .35s";
  }, 2600);
  setTimeout(() => t.remove(), 3000);
}

// ============ PRELOADER ============
window.addEventListener("load", () => {
  const pl = document.getElementById("preloader");
  if (pl) setTimeout(() => pl.classList.add("hide"), 400);
});

// ============ NAVBAR SCROLL ============
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar-edu");
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  const btt = document.getElementById("backToTop");
  if (btt) btt.classList.toggle("show", window.scrollY > 400);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (el.dataset.done) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.dataset.done = "1";
      const target = +el.dataset.count;
      let n = 0;
      const step = target / 60;
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
window.addEventListener("load", animateCounters);

// ============ NEWSLETTER ============
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    showToast("Email không hợp lệ!", "error");
    return;
  }
  const list = JSON.parse(localStorage.getItem("eduland_newsletter") || "[]");
  if (list.includes(email)) {
    showToast("Email đã đăng ký trước đó!", "info");
    return;
  }
  list.push(email);
  localStorage.setItem("eduland_newsletter", JSON.stringify(list));
  document.getElementById("newsletterEmail").value = "";
  showToast("Đăng ký nhận tin thành công!", "success");
}

// ============ HAMBURGER ============
document.addEventListener("DOMContentLoaded", () => {
  const ham = document.getElementById("hamburger");
  const links = document.querySelector(".nav-links");
  if (ham && links) {
    ham.addEventListener("click", () => links.classList.toggle("mobile-open"));
  }
  // Back to top button
  const btt = document.getElementById("backToTop");
  if (btt) btt.addEventListener("click", scrollToTop);
  // Search
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const q = document.getElementById("searchInput")?.value.trim();
      if (q) location.href = `courses.html?q=${encodeURIComponent(q)}`;
    });
  }
});

// ============ RENDER COURSE CARD ============
function courseCardHTML(c, showAddBtn = true) {
  const levelBadge = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced",
  }[c.level];
  return `
    <div class="course-card" data-aos="fade-up">
      <div class="course-thumb">
        <span class="course-level">${c.level}</span>
        <i class="bi ${c.icon}"></i>
      </div>
      <div class="course-body">
        <span class="course-cat">${c.category}</span>
        <h5 class="course-title">${c.title}</h5>
        <div class="course-instructor"><i class="bi bi-person-circle"></i> ${c.instructor}</div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="rating"><i class="bi bi-star-fill"></i> ${c.rating}</span>
          <small class="text-muted">(${c.reviews.toLocaleString("vi-VN")} đánh giá)</small>
        </div>
        <div class="course-meta">
          <div class="price">
            ${c.oldPrice ? `<span class="old">${fmt(c.oldPrice)}</span>` : ""}${fmt(c.price)}
          </div>
          ${showAddBtn ? `<button class="btn-edu" style="padding:8px 16px;font-size:0.85rem" onclick="addToCart(${c.id})"><i class="bi bi-cart-plus"></i> Thêm</button>` : ""}
        </div>
        <a href="course-detail.html?id=${c.id}" class="mt-3 d-block text-center fw-semibold" style="font-size:0.88rem">Xem chi tiết →</a>
      </div>
    </div>`;
}

// ============ RENDER INSTRUCTOR CARD ============
function instructorCardHTML(i) {
  return `
    <div class="instructor-card" data-aos="zoom-in">
      <div class="instructor-avatar">${i.name.split(" ").pop().charAt(0)}</div>
      <h4>${i.name}</h4>
      <div class="role">${i.role}</div>
      <div class="socials">
        <a href="#"><i class="bi bi-facebook"></i></a>
        <a href="#"><i class="bi bi-twitter-x"></i></a>
        <a href="#"><i class="bi bi-linkedin"></i></a>
      </div>
      <a href="instructor-detail.html?id=${i.id}" class="btn-edu-outline mt-3" style="padding:6px 18px;font-size:0.85rem">Xem chi tiết</a>
    </div>`;
}

// ============ RENDER BLOG CARD ============
function blogCardHTML(b) {
  return `
    <div class="blog-card" data-aos="fade-up">
      <div class="blog-thumb"><i class="bi ${b.icon}"></i></div>
      <div class="blog-body">
        <span class="blog-tag">${b.tag}</span>
        <h4>${b.title}</h4>
        <p>${b.excerpt}</p>
        <div class="blog-meta">
          <span><i class="bi bi-person"></i> ${b.author}</span>
          <span><i class="bi bi-clock"></i> ${b.readTime}</span>
        </div>
        <a href="blog-detail.html?id=${b.id}" class="mt-2 fw-semibold" style="font-size:0.9rem">Đọc tiếp →</a>
      </div>
    </div>`;
}
