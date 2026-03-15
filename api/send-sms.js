// POST /api/send-sms  —  发送短信验证码（阿里云短信）
const db = require('./db');
const { rateLimit, getRateLimitRemaining, setCORS, getClientIP, sanitize, securityLog } = require('./security');

// 阿里云短信SDK
const Dysmsapi = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');

function createSmsClient() {
    const config = new OpenApi.Config({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    return new Dysmsapi.default(config);
}

module.exports = async (req, res) => {
    setCORS(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: '仅支持POST请求' });

    const ip = getClientIP(req);
    const { phone } = req.body || {};

    if (!phone || !/^1\d{10}$/.test(phone)) {
        return res.status(400).json({ error: '请输入正确的手机号' });
    }

    // IP级限流：每个IP每10分钟最多5次
    if (!rateLimit(`sms_ip:${ip}`, 5, 10 * 60 * 1000)) {
        const retryAfter = getRateLimitRemaining(`sms_ip:${ip}`);
        securityLog('SMS_RATE_LIMIT_IP', { ip, phone });
        return res.status(429).json({ error: `请求过于频繁，请${retryAfter}秒后重试` });
    }

    // 手机号级限流：60秒内只能发一次
    const recentCode = db.getRecentCode(phone);
    if (recentCode && (Date.now() - recentCode.createTime) < 60000) {
        return res.status(429).json({ error: '发送太频繁，请60秒后重试' });
    }

    // 手机号级限流：每个手机号每小时最多6次
    if (!rateLimit(`sms_phone:${phone}`, 6, 60 * 60 * 1000)) {
        securityLog('SMS_RATE_LIMIT_PHONE', { ip, phone });
        return res.status(429).json({ error: '该手机号发送次数过多，请1小时后重试' });
    }

    // 生成6位随机验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));
    db.saveSmsCode(phone, code);

    // ===== 发送短信 =====
    const hasAliyunConfig = process.env.ALIYUN_ACCESS_KEY_ID && process.env.ALIYUN_ACCESS_KEY_SECRET;

    if (hasAliyunConfig) {
        try {
            const client = createSmsClient();
            const sendReq = new Dysmsapi.SendSmsRequest({
                phoneNumbers: phone,
                signName: process.env.ALIYUN_SMS_SIGN || '菊池实验室',
                templateCode: process.env.ALIYUN_SMS_TEMPLATE || '',
                templateParam: JSON.stringify({ code }),
            });
            const runtime = new Util.RuntimeOptions({});
            const result = await client.sendSmsWithOptions(sendReq, runtime);

            if (result.body.code !== 'OK') {
                console.error('[SMS] 发送失败:', result.body.message);
                return res.status(500).json({ error: '短信发送失败，请稍后重试' });
            }

            securityLog('SMS_SENT', { phone, ip });
            return res.status(200).json({ success: true, message: '验证码已发送到您的手机' });
        } catch (err) {
            console.error('[SMS] 阿里云API错误:', err.message);
            return res.status(500).json({ error: '短信服务暂时不可用，请稍后重试' });
        }
    } else {
        // 演示模式：验证码仅打印到服务端日志，不返回给前端
        console.log(`[SMS-DEMO] 手机号: ${phone}, 验证码: ${code}`);
        return res.status(200).json({
            success: true,
            message: '验证码已发送（演示模式）',
            code // 演示模式保留，配置阿里云后自动消失
        });
    }
};
