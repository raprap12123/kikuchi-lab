// POST /api/register  —  用户注册
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { rateLimit, setCORS, getClientIP, sanitize, securityLog } = require('./security');

const JWT_SECRET = process.env.JWT_SECRET || 'kikuchi-lab-secret-key-2024';

module.exports = async (req, res) => {
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

    const ip = getClientIP(req);
    const { name, phone, smsCode, organization, email, password } = req.body || {};

    // IP级限流：每个IP每小时最多10次注册
    if (!rateLimit(`reg_ip:${ip}`, 10, 60 * 60 * 1000)) {
        securityLog('REGISTER_RATE_LIMIT', { ip, phone });
        return res.status(429).json({ error: '注册请求过于频繁，请稍后重试' });
    }

    // 校验必填字段
    if (!name || !phone || !smsCode || !password) {
        return res.status(400).json({ error: '请填写所有必填项' });
    }

    if (!/^1\d{10}$/.test(phone)) {
        return res.status(400).json({ error: '手机号格式不正确' });
    }

    // 加强密码策略：至少8位，包含字母和数字
    if (password.length < 8) {
        return res.status(400).json({ error: '密码至少8位' });
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({ error: '密码需包含字母和数字' });
    }

    // 输入长度限制
    if (name.length > 50) return res.status(400).json({ error: '姓名过长' });
    if (organization && organization.length > 100) return res.status(400).json({ error: '单位名称过长' });
    if (email && email.length > 100) return res.status(400).json({ error: '邮箱过长' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 验证码限流：每个手机号每5分钟最多5次验证尝试
    if (!rateLimit(`verify:${phone}`, 5, 5 * 60 * 1000)) {
        securityLog('VERIFY_RATE_LIMIT', { ip, phone });
        return res.status(429).json({ error: '验证码验证过于频繁，请稍后重试' });
    }

    // 验证短信验证码
    if (!db.verifySmsCode(phone, smsCode)) {
        securityLog('REGISTER_BAD_CODE', { ip, phone });
        return res.status(400).json({ error: '验证码错误或已过期' });
    }

    // 检查手机号是否已注册
    if (db.findUserByPhone(phone)) {
        return res.status(400).json({ error: '该手机号已注册' });
    }

    // 输入清理（防XSS）
    const cleanName = sanitize(name);
    const cleanOrg = sanitize(organization || '');
    const cleanEmail = sanitize(email || '');

    // 密码加密（bcrypt hash）
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = db.createUser({
        name: cleanName,
        phone,
        organization: cleanOrg,
        email: cleanEmail,
        password: hashedPassword
    });

    // 生成JWT token（24小时有效）
    const token = jwt.sign(
        { id: user.id, phone: user.phone, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    const { password: _, ...safeUser } = user;

    securityLog('REGISTER_SUCCESS', { ip, phone, userId: user.id });
    return res.status(200).json({
        success: true,
        message: '注册成功',
        user: safeUser,
        token
    });
};
