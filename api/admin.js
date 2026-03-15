// GET /api/admin?type=users  —  查看所有注册用户（管理员接口）
// GET /api/admin?type=orders  —  查看所有订单
const db = require('./db');
const { rateLimit, setCORS, getClientIP, timingSafeCompare, securityLog } = require('./security');

const ADMIN_KEY = process.env.ADMIN_KEY || (() => { console.warn('[WARN] ADMIN_KEY not set, using auto-generated key. Set ADMIN_KEY env var for production!'); return require('crypto').randomBytes(32).toString('hex'); })();

module.exports = async (req, res) => {
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: '仅支持GET请求' });

    const ip = getClientIP(req);

    // 管理员接口限流：每个IP每5分钟最多10次
    if (!rateLimit(`admin_ip:${ip}`, 10, 5 * 60 * 1000)) {
        securityLog('ADMIN_RATE_LIMIT', { ip });
        return res.status(429).json({ error: '请求过于频繁' });
    }

    // 使用时序安全比较验证管理员密钥
    const adminKey = req.headers['x-admin-key'] || '';
    if (!timingSafeCompare(adminKey, ADMIN_KEY)) {
        securityLog('ADMIN_AUTH_FAILED', { ip });
        return res.status(403).json({ error: '无权访问' });
    }

    securityLog('ADMIN_ACCESS', { ip, type: req.query.type });

    const type = req.query.type || 'users';

    if (type === 'users') {
        const users = db.getUsers();
        const safeUsers = users.map(u => ({
            ...u,
            password: '[bcrypt加密，不可逆]'
        }));
        return res.status(200).json({ success: true, total: safeUsers.length, users: safeUsers });
    }

    if (type === 'orders') {
        const orders = db.getOrders();
        return res.status(200).json({ success: true, total: orders.length, orders });
    }

    return res.status(400).json({ error: '参数错误，type 可选 users 或 orders' });
};
