// GET /api/admin?type=users  —  查看所有注册用户（管理员接口）
// GET /api/admin?type=orders  —  查看所有订单
// 需要管理员密钥验证
const db = require('./db');

const ADMIN_KEY = process.env.ADMIN_KEY || 'kikuchi-admin-2024';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: '仅支持GET请求' });

    // 验证管理员密钥
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({ error: '无权访问' });
    }

    const type = req.query.type || 'users';

    if (type === 'users') {
        const users = db.getUsers();
        // 返回用户列表，密码字段替换为"[已加密]"
        const safeUsers = users.map(u => ({
            ...u,
            password: '[bcrypt加密，不可逆]'
        }));
        return res.status(200).json({
            success: true,
            total: safeUsers.length,
            users: safeUsers
        });
    }

    if (type === 'orders') {
        const orders = db.getOrders();
        return res.status(200).json({
            success: true,
            total: orders.length,
            orders
        });
    }

    return res.status(400).json({ error: '参数错误，type 可选 users 或 orders' });
};
