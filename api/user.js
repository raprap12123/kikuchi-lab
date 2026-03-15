// GET /api/user  —  获取当前用户信息（需要token）
// PUT /api/user  —  更新用户信息
const jwt = require('jsonwebtoken');
const db = require('./db');
const { rateLimit, setCORS, getClientIP, sanitize, securityLog } = require('./security');

const JWT_SECRET = process.env.JWT_SECRET || (() => { console.warn('[WARN] JWT_SECRET not set, using auto-generated key. Set JWT_SECRET env var for production!'); return require('crypto').randomBytes(32).toString('hex'); })();

function verifyToken(req) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return null;
    try {
        return jwt.verify(auth.slice(7), JWT_SECRET);
    } catch {
        return null;
    }
}

module.exports = async (req, res) => {
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const ip = getClientIP(req);

    // API限流
    if (!rateLimit(`user_ip:${ip}`, 30, 60 * 1000)) {
        return res.status(429).json({ error: '请求过于频繁' });
    }

    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: '请先登录' });
    }

    const user = db.findUserByPhone(decoded.phone);
    if (!user) {
        return res.status(404).json({ error: '用户不存在' });
    }

    if (req.method === 'GET') {
        const { password, ...safeUser } = user;
        return res.status(200).json({ success: true, user: safeUser });
    }

    if (req.method === 'PUT') {
        const { name, organization, email } = req.body || {};

        // 输入验证
        if (name && name.length > 50) return res.status(400).json({ error: '姓名过长' });
        if (organization && organization.length > 100) return res.status(400).json({ error: '单位名称过长' });
        if (email && email.length > 100) return res.status(400).json({ error: '邮箱过长' });
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' });
        }

        const updated = db.updateUser(decoded.phone, {
            ...(name && { name: sanitize(name) }),
            ...(organization && { organization: sanitize(organization) }),
            ...(email && { email: sanitize(email) })
        });
        const { password, ...safeUser } = updated;

        securityLog('USER_UPDATE', { ip, phone: decoded.phone });
        return res.status(200).json({ success: true, user: safeUser });
    }

    return res.status(405).json({ error: '不支持的请求方法' });
};
