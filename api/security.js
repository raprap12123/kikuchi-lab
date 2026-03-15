// ========== 安全中间件模块 ==========
const crypto = require('crypto');

// --- 1. 速率限制（内存级，Vercel serverless 冷启动会重置） ---
// 生产环境建议用 Redis/Vercel KV 持久化
const rateLimitStore = {};

function rateLimit(key, maxAttempts, windowMs) {
    const now = Date.now();
    if (!rateLimitStore[key]) {
        rateLimitStore[key] = { count: 1, resetAt: now + windowMs };
        return true;
    }
    if (now > rateLimitStore[key].resetAt) {
        rateLimitStore[key] = { count: 1, resetAt: now + windowMs };
        return true;
    }
    rateLimitStore[key].count++;
    return rateLimitStore[key].count <= maxAttempts;
}

function getRateLimitRemaining(key) {
    const record = rateLimitStore[key];
    if (!record) return null;
    return Math.max(0, Math.ceil((record.resetAt - Date.now()) / 1000));
}

// --- 2. 输入清理（防XSS） ---
function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim()
        .substring(0, 500); // 限制最大长度
}

// --- 3. CORS（限制来源） ---
function setCORS(req, res) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : null;
    const origin = req.headers.origin;

    if (!allowedOrigins) {
        // Development mode: allow all origins but warn
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    } else if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key');
}

// --- 4. 安全比较（防时序攻击） ---
function timingSafeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    try {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
    } catch {
        return false;
    }
}

// --- 5. 获取客户端IP ---
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || 'unknown';
}

// --- 6. 安全日志 ---
function securityLog(event, details) {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} | ${event} | ${JSON.stringify(details)}`);
}

module.exports = {
    rateLimit,
    getRateLimitRemaining,
    sanitize,
    setCORS,
    timingSafeCompare,
    getClientIP,
    securityLog
};
