// POST /api/register  —  用户注册
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

    const { name, phone, smsCode, organization, email, password } = req.body || {};

    // 校验必填字段
    if (!name || !phone || !smsCode || !password) {
        return res.status(400).json({ error: '请填写所有必填项' });
    }

    if (!/^1\d{10}$/.test(phone)) {
        return res.status(400).json({ error: '手机号格式不正确' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: '密码至少6位' });
    }

    // 验证短信验证码
    if (!db.verifySmsCode(phone, smsCode)) {
        return res.status(400).json({ error: '验证码错误或已过期' });
    }

    // 检查手机号是否已注册
    if (db.findUserByPhone(phone)) {
        return res.status(400).json({ error: '该手机号已注册' });
    }

    // 密码加密（bcrypt hash，不可逆）
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = db.createUser({
        name,
        phone,
        organization: organization || '',
        email: email || '',
        password: hashedPassword  // 存储的是加密后的hash，无法还原明文
    });

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
        message: '注册成功',
        user: safeUser,
        token
    });
};
