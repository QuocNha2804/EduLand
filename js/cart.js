// ==========================================
// EduLand — Shopping Cart Manager
// ==========================================

const CART_KEY = "eduland_cart";
window.__discount = window.__discount || 0;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(c) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
  } catch (e) {}
  updateCartBadge();
}

function addToCart(id) {
  const cart = getCart();
  if (cart.includes(id)) {
    showToast("Khóa học này đã có trong giỏ hàng!", "info");
    return;
  }
  cart.push(id);
  saveCart(cart);
  showToast("Đã thêm khóa học vào giỏ hàng thành công!", "success");
}

function removeFromCart(id) {
  const cart = getCart().filter((i) => i !== id);
  saveCart(cart);
  showToast("Đã xóa khóa học khỏi giỏ hàng!", "info");
  if (document.getElementById("cartItems")) {
    renderCartPage();
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = getCart().length;
  }
}

function clearCart() {
  window.__discount = 0;
  saveCart([]);
}

function renderCartPage() {
  const wrap = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  if (!wrap) return;

  const cart = getCart();
  const items = COURSES.filter((c) => cart.includes(c.id));

  if (items.length === 0) {
    wrap.innerHTML = `
      <div class="text-center py-5" data-aos="fade-up">
        <i class="bi bi-cart-x" style="font-size:4rem;color:var(--text-muted)"></i>
        <h4 class="mt-3">Giỏ hàng của bạn đang trống</h4>
        <p class="text-muted">Hãy khám phá các khóa học chất lượng cao và thêm vào giỏ hàng.</p>
        <a href="${getHtmlPath("courses.html")}" class="btn-edu mt-2">
          <i class="bi bi-compass"></i> Khám phá khóa học ngay
        </a>
      </div>`;
    if (summary) summary.style.display = "none";
    return;
  }

  if (summary) summary.style.display = "block";
  wrap.innerHTML = items
    .map(
      (c) => `
    <div class="cart-item" data-aos="fade-up">
      <div class="thumb"><i class="bi ${c.icon}"></i></div>
      <div class="info">
        <h5><a href="${getHtmlPath("course-detail.html")}?id=${c.id}" style="color:inherit">${c.title}</a></h5>
        <div class="inst"><i class="bi bi-person-circle"></i> ${c.instructor} &nbsp;·&nbsp; <span>${c.duration}</span></div>
      </div>
      <div class="price">${fmt(c.price)}</div>
      <button class="remove" onclick="removeFromCart(${c.id})" title="Xóa khỏi giỏ" aria-label="Xóa"><i class="bi bi-trash"></i></button>
    </div>`
    )
    .join("");

  updateSummary(items);
}

function updateSummary(items) {
  const subtotal = items.reduce((s, c) => s + c.price, 0);
  const discountRate = window.__discount || 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal - discountAmount);

  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
  if (discountEl) {
    discountEl.textContent = discountAmount > 0 ? `-${fmt(discountAmount)}` : "0đ";
  }
  if (totalEl) totalEl.textContent = fmt(total);
}

function applyCoupon() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const map = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    EDULAND30: 0.3,
  };

  if (map[code]) {
    window.__discount = map[code];
    showToast(`Áp dụng mã ${code}: Giảm ${map[code] * 100}% thành công!`, "success");
  } else {
    window.__discount = 0;
    showToast("Mã giảm giá không hợp lệ hoặc đã hết hạn!", "error");
  }
  renderCartPage();
}

function checkout() {
  if (getCart().length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "warning");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("show");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("show");
}

function confirmCheckout() {
  const items = COURSES.filter((c) => getCart().includes(c.id));
  const orderId = "EDL" + Math.floor(100000 + Math.random() * 900000);
  clearCart();
  closeCheckoutModal();

  const wrap = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");

  if (wrap) {
    wrap.innerHTML = `
      <div class="text-center py-5" data-aos="zoom-in">
        <div class="icon-circle" style="background:#06d6a0;color:#fff"><i class="bi bi-check2"></i></div>
        <h3 class="mt-3">Đặt hàng thành công!</h3>
        <p class="text-muted">Mã đơn hàng: <strong class="text-primary">${orderId}</strong></p>
        <p class="text-muted">Thông tin kích hoạt khóa học đã được gửi đến email của bạn. Bạn có thể bắt đầu học ngay bây giờ!</p>
        <div class="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <a href="${getHtmlPath("courses.html")}" class="btn-edu">
            <i class="bi bi-book"></i> Tiếp tục xem khóa học
          </a>
          <a href="${getRootPath("index.html")}" class="btn-edu-outline">
            <i class="bi bi-house"></i> Về trang chủ
          </a>
        </div>
      </div>`;
  }
  if (summary) summary.style.display = "none";
  updateCartBadge();
  showToast("Đặt hàng thành công! Cảm ơn bạn.", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("cartItems")) {
    renderCartPage();
  }

  // Coupon Enter key
  const couponInput = document.getElementById("couponInput");
  if (couponInput) {
    couponInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon();
      }
    });
  }

  // Checkout modal backdrop click to dismiss
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }
});
