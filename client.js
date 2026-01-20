const API_BASE = 'http://localhost:3000/api';

// --- TIỆN ÍCH ---
const getToken = () => localStorage.getItem('token');
const isLoggedIn = () => !!getToken();
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    return res;
}

// --- LOGIC GIỎ HÀNG ---
const cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

// CẬP NHẬT: Thêm tham số imgUrl
function addToCart(id, name, price, imgUrl) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
       cart.push({ id, name, price, imgUrl, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Hiệu ứng thông báo đơn giản (Thay cho alert)
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show align-items-center text-white bg-success border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    Đã thêm "${name}" vào giỏ hàng!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- LOGIC USER ---
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkLoginUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navAuth = document.getElementById('nav-auth');
    
    if (!navAuth) return; // Bảo vệ nếu trang không có navbar này

    if (user) {
        let adminLink = user.role === 1 ? `<li class="nav-item"><a class="nav-link text-danger fw-bold" href="admin.html"><i class="fas fa-user-shield me-1"></i>Quản trị</a></li>` : '';
        
        navAuth.innerHTML = `
            ${adminLink}
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i>Chào, ${user.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="logout()">Đăng xuất</a></li>
                </ul>
            </li>
        `;
    } else {
        navAuth.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="login.html"><i class="fas fa-sign-in-alt me-1"></i>Đăng nhập</a></li>
        `;
    }
    updateCartUI();
}

document.addEventListener('DOMContentLoaded', checkLoginUI);