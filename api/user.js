// GET /api/user  —  获取当前用户信息（需要token）
// PUT /api/user  —  更新用户信息
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'kikuchi-lab-secret-key-2024';

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

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
        const updated = db.updateUser(decoded.phone, {
            ...(name && { name }),
            ...(organization && { organization }),
            ...(email && { email })
        });
        const { password, ...safeUser } = updated;
        return res.status(200).json({ success: true, user: safeUser });
    }

    return res.status(405).json({ error: '不支持的请求方法' });
};
