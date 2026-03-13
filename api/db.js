// ========== 简易文件数据库（Vercel Serverless 共享模块） ==========
// 生产环境建议替换为 MongoDB Atlas / Vercel KV / PlanetScale
// 当前使用 /tmp 目录存储（Vercel serverless 冷启动会清空，正式上线需换数据库）

const fs = require('fs');
const path = require('path');

const DB_DIR = '/tmp/kikuchi-db';
const USERS_FILE = path.join(DB_DIR, 'users.json');
const CODES_FILE = path.join(DB_DIR, 'sms_codes.json');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');

function ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
}

function readJSON(file) {
    ensureDir();
    if (!fs.existsSync(file)) return [];
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        return [];
    }
}

function writeJSON(file, data) {
    ensureDir();
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// === Users ===
function getUsers() {
    return readJSON(USERS_FILE);
}

function findUserByPhone(phone) {
    return getUsers().find(u => u.phone === phone);
}

function createUser(userData) {
    const users = getUsers();
    userData.id = 'U' + Date.now().toString(36).toUpperCase();
    userData.createTime = new Date().toISOString();
    userData.balance = 0;
    users.push(userData);
    writeJSON(USERS_FILE, users);
    return userData;
}

function updateUser(phone, updates) {
    const users = getUsers();
    const idx = users.findIndex(u => u.phone === phone);
    if (idx < 0) return null;
    Object.assign(users[idx], updates);
    writeJSON(USERS_FILE, users);
    return users[idx];
}

// === SMS Codes ===
function getRecentCode(phone) {
    const codes = readJSON(CODES_FILE);
    return codes.find(c => c.phone === phone) || null;
}

function saveSmsCode(phone, code) {
    const codes = readJSON(CODES_FILE);
    // 移除该手机号旧的验证码
    const filtered = codes.filter(c => c.phone !== phone);
    filtered.push({
        phone,
        code,
        createTime: Date.now(),
        expires: Date.now() + 5 * 60 * 1000 // 5分钟有效
    });
    writeJSON(CODES_FILE, filtered);
}

function verifySmsCode(phone, code) {
    const codes = readJSON(CODES_FILE);
    const record = codes.find(c => c.phone === phone && c.code === code);
    if (!record) return false;
    if (Date.now() > record.expires) return false;
    // 验证成功后删除
    writeJSON(CODES_FILE, codes.filter(c => c.phone !== phone));
    return true;
}

// === Orders ===
function getOrders(phone) {
    const orders = readJSON(ORDERS_FILE);
    if (phone) return orders.filter(o => o.phone === phone);
    return orders;
}

function createOrder(orderData) {
    const orders = readJSON(ORDERS_FILE);
    orderData.id = 'KL' + Date.now().toString(36).toUpperCase();
    orderData.createTime = new Date().toISOString();
    orderData.status = '待确认';
    orders.push(orderData);
    writeJSON(ORDERS_FILE, orders);
    return orderData;
}

module.exports = {
    getUsers, findUserByPhone, createUser, updateUser,
    getRecentCode, saveSmsCode, verifySmsCode,
    getOrders, createOrder
};
