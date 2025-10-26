// Frontend logic: loads orders from /api/orders and handles cart/checkout
async function loadOrders() {
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    if (!Array.isArray(orders) || orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2">Chưa có đơn hàng nào.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o =>
      `<tr><td class="order-item">${escapeHtml(o.name)} mua ${o.items.length} key - ${numberWithCommas(o.total)}đ</td><td>${escapeHtml(o.time)}</td></tr>`
    ).join('');
  } catch (e) {
    console.error(e);
  }
}

// Simulated deposits feed (to keep UI behavior similar to original)
function loadDeposits() {
  const depositsTbody = document.querySelector('#deposits-table tbody');
  const sample = [
    { text: '...user123 thực hiện nạp 10.000đ - MBBank', time: 'vừa xong' },
    { text: '...player456 thực hiện nạp 50.000đ - MBBank', time: '5 phút trước' },
    { text: '...gamer789 thực hiện nạp 150.000đ - MBBank', time: '10 phút trước' }
  ];
  depositsTbody.innerHTML = sample.map(d => `<tr><td class="deposit-item">${d.text}</td><td>${d.time}</td></tr>`).join('');
}

// Utilities
function numberWithCommas(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; }); }

// Cart
let cart = [];
function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
  alert(`${name} đã thêm vào giỏ!`);
}
function updateCart() {
  const itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = cart.map(item => `<div class="cart-item">${escapeHtml(item.name)} - ${numberWithCommas(item.price)}đ</div>`).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('total').textContent = numberWithCommas(total) + 'đ';
}
async function checkout() {
  if (cart.length === 0) {
    alert('Giỏ hàng trống! Hãy chọn key để mua.');
    return;
  }
  const name = prompt('Nhập tên hoặc Telegram của bạn để xác nhận đơn:');
  if (!name) return;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  // Apply discount if 5+ keys
  const discount = cart.length >= 5 ? Math.round(total * 0.05) : 0;
  const finalTotal = total - discount;

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, items: cart, total: finalTotal })
    });
    const data = await res.json();
    if (data && data.success) {
      alert(`Đơn hàng của bạn đã được ghi nhận!\nMã đơn: ${data.orderId || '---'}\nVui lòng nạp tiền vào: MBBank - 0845118872\nSau khi nạp, gửi STK + tên (${name}) để nhận key.\nXử lý thường trong vài phút.`);
      cart = [];
      updateCart();
      loadOrders();
    } else {
      alert('Có lỗi khi tạo đơn. Vui lòng thử lại.');
    }
  } catch (e) {
    console.error(e);
    alert('Lỗi kết nối tới server.');
  }
}

window.addEventListener('load', () => {
  loadOrders();
  loadDeposits();
  setInterval(loadOrders, 30000);
  setInterval(loadDeposits, 30000);
});
