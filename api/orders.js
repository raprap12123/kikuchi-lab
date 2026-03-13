// GET /api/orders  —  获取用户订单
// POST /api/orders  —  创建新订单
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: '请先登录' });
    }

    if (req.method === 'GET') {
        const orders = db.getOrders(decoded.phone);
        return res.status(200).json({ success: true, orders });
    }

    if (req.method === 'POST') {
        const { service, quantity, preferDate, sampleInfo, total, delivery } = req.body || {};
        if (!service) {
            return res.status(400).json({ error: '请选择服务项目' });
        }

        const user = db.findUserByPhone(decoded.phone);
        const order = db.createOrder({
            name: user.name,
            phone: user.phone,
            organization: user.organization,
            email: user.email,
            service,
            quantity: quantity || 1,
            preferDate: preferDate || '',
            sampleInfo: sampleInfo || '',
            total: total || '',
            delivery: delivery || '快递'
        });

        return res.status(200).json({ success: true, order });
    }

    return res.status(405).json({ error: '不支持的请求方法' });
};
