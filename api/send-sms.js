// POST /api/send-sms  —  发送短信验证码（阿里云短信）
const db = require('./db');

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

    // 防刷：同一手机号60秒内只能发一次
    const recentCode = db.getRecentCode(phone);
    if (recentCode && (Date.now() - recentCode.createTime) < 60000) {
        return res.status(429).json({ error: '发送太频繁，请60秒后重试' });
    }

    // 生成6位随机验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 保存到数据库
    db.saveSmsCode(phone, code);

    // ===== 发送短信 =====
    const hasAliyunConfig = process.env.ALIYUN_ACCESS_KEY_ID && process.env.ALIYUN_ACCESS_KEY_SECRET;

    if (hasAliyunConfig) {
        // 正式模式：调用阿里云短信API
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

            console.log(`[SMS] 真实发送成功 -> ${phone}`);
            return res.status(200).json({
                success: true,
                message: '验证码已发送到您的手机'
            });
        } catch (err) {
            console.error('[SMS] 阿里云API错误:', err.message);
            return res.status(500).json({ error: '短信服务暂时不可用，请稍后重试' });
        }
    } else {
        // 演示模式：未配置阿里云密钥时自动填入验证码
        console.log(`[SMS-DEMO] 手机号: ${phone}, 验证码: ${code}`);
        return res.status(200).json({
            success: true,
            message: '验证码已发送（演示模式）',
            code  // 演示模式返回验证码，配置阿里云后此字段自动消失
        });
    }
};
