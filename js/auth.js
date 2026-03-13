// ========== 认证模块 —— 对接后端API ==========

const AUTH_API = '/api';

// ===== API 请求封装 =====
async function authFetch(endpoint, options = {}) {
    const token = localStorage.getItem('kl_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const resp = await fetch(`${AUTH_API}${endpoint}`, {
            ...options,
            headers
        });
        const data = await resp.json();
        if (!resp.ok) {
            throw new Error(data.error || '请求失败');
        }
        return data;
    } catch (err) {
        throw err;
    }
}

// ===== 发送短信验证码 =====
async function sendSmsCode(phone) {
    const data = await authFetch('/send-sms', {
        method: 'POST',
        body: JSON.stringify({ phone })
    });
    return data;
}

// ===== 注册 =====
async function registerUser(userData) {
    const data = await authFetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    // 保存token和用户信息
    localStorage.setItem('kl_token', data.token);
    localStorage.setItem('kl_user', JSON.stringify(data.user));
    return data;
}

// ===== 登录 =====
async function loginUser(phone, password) {
    const data = await authFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password })
    });
    localStorage.setItem('kl_token', data.token);
    localStorage.setItem('kl_user', JSON.stringify(data.user));
    return data;
}

// ===== 获取当前用户 =====
async function getCurrentUser() {
    const token = localStorage.getItem('kl_token');
    if (!token) return null;
    try {
        const data = await authFetch('/user', { method: 'GET' });
        localStorage.setItem('kl_user', JSON.stringify(data.user));
        return data.user;
    } catch {
        // token过期或无效
        logout();
        return null;
    }
}

// ===== 更新用户信息 =====
async function updateProfile(updates) {
    const data = await authFetch('/user', {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    localStorage.setItem('kl_user', JSON.stringify(data.user));
    return data.user;
}

// ===== 提交订单 =====
async function submitOrder(orderData) {
    const data = await authFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
    return data.order;
}

// ===== 获取订单列表 =====
async function getMyOrders() {
    const data = await authFetch('/orders', { method: 'GET' });
    return data.orders;
}

// ===== 退出登录 =====
function logout() {
    localStorage.removeItem('kl_token');
    localStorage.removeItem('kl_user');
}

// ===== 获取本地缓存的用户（不请求API） =====
function getCachedUser() {
    try {
        const u = localStorage.getItem('kl_user');
        return u ? JSON.parse(u) : null;
    } catch {
        return null;
    }
}

// ===== 是否已登录 =====
function isLoggedIn() {
    return !!localStorage.getItem('kl_token');
}
