// GET /api/orders  —  获取用户订单
// POST /api/orders  —  创建新订单
const jwt = require('jsonwebtoken');
const db = require('./db');
const { rateLimit, setCORS, getClientIP, sanitize, securityLog } = require('./security');

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
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const ip = getClientIP(req);

    // API限流
    if (!rateLimit(`orders_ip:${ip}`, 30, 60 * 1000)) {
        return res.status(429).json({ error: '请求过于频繁' });
    }

    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: '请先登录' });
    }

    if (req.method === 'GET') {
        const orders = db.getOrders(decoded.phone);
        return res.status(200).json({ success: true, orders });
    }

    if (req.method === 'POST') {
        // 订单创建限流：每个用户每分钟最多3个
        if (!rateLimit(`order_create:${decoded.phone}`, 3, 60 * 1000)) {
            return res.status(429).json({ error: '下单过于频繁，请稍后重试' });
        }

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
            service: sanitize(service),
            quantity: Math.min(Math.max(parseInt(quantity) || 1, 1), 999),
            preferDate: sanitize(preferDate || ''),
            sampleInfo: sanitize(sampleInfo || '').substring(0, 1000),
            total: sanitize(total || ''),
            delivery: ['自送', '快递'].includes(delivery) ? delivery : '快递'
        });

        securityLog('ORDER_CREATED', { ip, phone: decoded.phone, orderId: order.id });
        return res.status(200).json({ success: true, order });
    }

    return res.status(405).json({ error: '不支持的请求方法' });
};
