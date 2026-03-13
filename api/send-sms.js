// POST /api/send-sms  —  发送短信验证码
const db = require('./db');

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

    const { phone } = req.body || {};

    if (!phone || !/^1\d{10}$/.test(phone)) {
        return res.status(400).json({ error: '请输入正确的手机号' });
    }

    // 生成6位随机验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 保存到数据库
    db.saveSmsCode(phone, code);

    // ===== 短信发送 =====
    // 当前为演示模式，验证码打印到控制台
    // 正式上线时替换为阿里云/腾讯云短信API：
    //
    // 阿里云短信示例：
    // const China_SMS = require('@alicloud/dysmsapi20170525');
    // await client.sendSms({
    //     phoneNumbers: phone,
    //     signName: '菊池实验室',
    //     templateCode: 'SMS_XXXXXX',
    //     templateParam: JSON.stringify({ code })
    // });

    console.log(`[SMS] 手机号: ${phone}, 验证码: ${code}`);

    // 开发/演示模式：返回验证码（正式上线删除此行！）
    const isDev = process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true';

    return res.status(200).json({
        success: true,
        message: '验证码已发送',
        ...(isDev ? { code } : {}) // 仅开发模式返回验证码
    });
};
