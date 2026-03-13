// POST /api/login  —  用户登录
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'kikuchi-lab-secret-key-2024';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

    const { phone, password } = req.body || {};

    if (!phone || !password) {
        return res.status(400).json({ error: '请输入手机号和密码' });
    }

    // 查找用户
    const user = db.findUserByPhone(phone);
    if (!user) {
        return res.status(401).json({ error: '账号或密码错误' });
    }

    // 验证密码（bcrypt比对，安全不可逆）
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: '账号或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign(
        { id: user.id, phone: user.phone, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = user;

    return res.status(200).json({
        success: true,
        message: '登录成功',
        user: safeUser,
        token
    });
};
