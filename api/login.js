// POST /api/login  —  用户登录
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { rateLimit, getRateLimitRemaining, setCORS, getClientIP, securityLog } = require('./security');

const JWT_SECRET = process.env.JWT_SECRET || 'kikuchi-lab-secret-key-2024';

module.exports = async (req, res) => {
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

    const ip = getClientIP(req);
    const { phone, password } = req.body || {};

    if (!phone || !password) {
        return res.status(400).json({ error: '请输入手机号和密码' });
    }

    // IP级限流：每个IP每5分钟最多10次登录尝试
    if (!rateLimit(`login_ip:${ip}`, 10, 5 * 60 * 1000)) {
        const retryAfter = getRateLimitRemaining(`login_ip:${ip}`);
        securityLog('LOGIN_RATE_LIMIT_IP', { ip, phone });
        return res.status(429).json({ error: `登录尝试过于频繁，请${retryAfter}秒后重试` });
    }

    // 账号级限流：每个手机号每5分钟最多5次
    if (!rateLimit(`login_phone:${phone}`, 5, 5 * 60 * 1000)) {
        securityLog('LOGIN_RATE_LIMIT_PHONE', { ip, phone });
        return res.status(429).json({ error: '该账号登录尝试过多，请5分钟后重试' });
    }

    // 查找用户
    const user = db.findUserByPhone(phone);
    if (!user) {
        securityLog('LOGIN_FAILED_NO_USER', { ip, phone });
        return res.status(401).json({ error: '账号或密码错误' });
    }

    // 验证密码（bcrypt比对）
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        securityLog('LOGIN_FAILED_WRONG_PASSWORD', { ip, phone });
        return res.status(401).json({ error: '账号或密码错误' });
    }

    // 生成JWT token（缩短有效期至24小时）
    const token = jwt.sign(
        { id: user.id, phone: user.phone, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    const { password: _, ...safeUser } = user;

    securityLog('LOGIN_SUCCESS', { ip, phone, userId: user.id });
    return res.status(200).json({
        success: true,
        message: '登录成功',
        user: safeUser,
        token
    });
};
