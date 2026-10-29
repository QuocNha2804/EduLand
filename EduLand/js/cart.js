const CART_KEY = "eduland_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  updateCartBadge();
}
function addToCart(id) {
  const cart = getCart();
  if (cart.includes(id)) {
    showToast("Khóa học đã có trong giỏ!", "info");
    return;
  }
  cart.push(id);
  saveCart(cart);
  showToast("Đã thêm khóa học vào giỏ!", "success");
}
function removeFromCart(id) {
  const cart = getCart().filter((i) => i !== id);
  saveCart(cart);
  showToast("Đã xóa khóa học khỏi giỏ!", "info");
  if (document.getElementById("cartItems")) renderCartPage();
}
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = getCart().length;
}
function clearCart() {
  saveCart([]);
}

function renderCartPage() {
  const wrap = document.getElementById("cartItems");
  if (!wrap) return;
  const cart = getCart();
  const items = COURSES.filter((c) => cart.includes(c.id));

  if (items.length === 0) {
    wrap.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size:4rem;color:var(--text-muted)"></i>
        <p class="mt-3 text-muted">Giỏ hàng trống</p>
        <a href="courses.html" class="btn-edu mt-2">Khám phá khóa học</a>
      </div>`;
    document.getElementById("cartSummary").style.display = "none";
    return;
  }
  document.getElementById("cartSummary").style.display = "block";
  wrap.innerHTML = items
    .map(
      (c) => `
    <div class="cart-item">
      <div class="thumb"><i class="bi ${c.icon}"></i></div>
      <div class="info">
        <h5>${c.title}</h5>
        <div class="inst"><i class="bi bi-person-circle"></i> ${c.instructor}</div>
      </div>
      <div class="price">${fmt(c.price)}</div>
      <button class="remove" onclick="removeFromCart(${c.id})"><i class="bi bi-trash"></i></button>
    </div>`,
    )
    .join("");

  updateSummary(items);
}

function updateSummary(items) {
  const subtotal = items.reduce((s, c) => s + c.price, 0);
  const discount = window.__discount || 0;
  const total = subtotal - subtotal * discount;
  document.getElementById("subtotal").textContent = fmt(subtotal);
  document.getElementById("discount").textContent =
    "-" + fmt(subtotal * discount);
  document.getElementById("total").textContent = fmt(total);
}

function applyCoupon() {
  const code = document
    .getElementById("couponInput")
    .value.trim()
    .toUpperCase();
  const map = { SAVE10: 0.1, SAVE20: 0.2 };
  if (map[code]) {
    window.__discount = map[code];
    showToast(`Áp dụng mã ${code}: giảm ${map[code] * 100}%!`, "success");
  } else {
    window.__discount = 0;
    showToast("Mã giảm giá không hợp lệ!", "error");
  }
  renderCartPage();
}

function checkout() {
  if (getCart().length === 0) return;
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("show");
}

function confirmCheckout() {
  clearCart();
  document.getElementById("checkoutModal").classList.remove("show");
  document.getElementById("cartItems").innerHTML = `
    <div class="text-center py-5">
      <div class="icon-circle"><i class="bi bi-check2"></i></div>
      <h4>Đặt hàng thành công!</h4>
      <p class="text-muted">Cảm ơn bạn đã mua khóa học tại EduLand.</p>
      <a href="courses.html" class="btn-edu mt-2">Tiếp tục mua sắm</a>
    </div>`;
  document.getElementById("cartSummary").style.display = "none";
  updateCartBadge();
}

function fmt(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("cartItems")) renderCartPage();
});
