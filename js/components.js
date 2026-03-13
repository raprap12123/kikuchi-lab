// ========== 公共组件：导航栏 + 页脚 + 客服 ==========
// 所有页面引用此文件，后期只改这一处

// 计算到根目录的相对路径
function getRoot() {
    const depth = (window.location.pathname.match(/pages/g) || []).length
        + (window.location.pathname.match(/services/g) || []).length;
    // 简单判断：如果URL含 /pages/services/ 则 ../../，含 /pages/ 则 ../，否则 ./
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/pages/services/')) return '../../';
    if (path.includes('/pages/')) return '../';
    return './';
}

const ROOT = getRoot();

function renderNavbar(activePage) {
    return `
    <div class="top-bar">
        <div class="container">
            <span><i class="fas fa-clock"></i> 工作时间：周一至周五 8:30 - 17:30</span>
            <div class="top-bar-right">
                <a href="tel:400-888-9999"><i class="fas fa-phone"></i> 400-888-9999</a>
                <a href="mailto:service@kikuchi-lab.com"><i class="fas fa-envelope"></i> service@kikuchi-lab.com</a>
            </div>
        </div>
    </div>
    <nav class="navbar" id="navbar">
        <div class="container">
            <a href="${ROOT}index.html" class="logo">
                <span class="logo-icon"><i class="fas fa-microscope"></i></span>
                <span class="logo-text">菊池实验室<small>KIKUCHI LAB</small></span>
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="${ROOT}index.html" ${activePage==='home'?'class="active"':''}>首页</a></li>
                <li class="dropdown">
                    <a href="${ROOT}pages/services.html" ${activePage==='services'?'class="active"':''}>测试服务 <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <a href="${ROOT}pages/services.html?cat=polishing">EBSD抛光制样</a>
                        <a href="${ROOT}pages/services.html?cat=ebsd">EBSD测试分析</a>
                        <a href="${ROOT}pages/services.html?cat=ecci">ECCI分析</a>
                        <a href="${ROOT}pages/services.html?cat=postprocess">EBSD后处理</a>
                        <a href="${ROOT}pages/services.html?cat=advanced">高级分析</a>
                    </div>
                </li>
                <li><a href="${ROOT}pages/simulation.html" ${activePage==='simulation'?'class="active"':''}>模拟仿真</a></li>
                <li><a href="${ROOT}pages/shop.html" ${activePage==='shop'?'class="active"':''}>耗材商城</a></li>
                <li><a href="${ROOT}pages/articles.html" ${activePage==='articles'?'class="active"':''}>EBSD干货</a></li>
                <li><a href="${ROOT}pages/about.html" ${activePage==='about'?'class="active"':''}>关于我们</a></li>
            </ul>
            <div class="nav-actions">
                <a href="${ROOT}index.html#booking" class="btn btn-primary btn-nav">立即预约</a>
                <button class="btn-login" id="loginBtn"><i class="fas fa-user"></i> 登录</button>
                <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>
            </div>
        </div>
    </nav>`;
}

function renderFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo"><i class="fas fa-microscope"></i> 菊池实验室</div>
                    <p>专业EBSD抛光与测试服务平台<br>让材料表征更简单</p>
                    <div class="footer-social">
                        <a href="#"><i class="fab fa-weixin"></i></a>
                        <a href="#"><i class="fas fa-blog"></i></a>
                        <a href="#"><i class="fab fa-weibo"></i></a>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>测试服务</h4>
                    <a href="${ROOT}pages/services.html?cat=polishing">EBSD抛光制样</a>
                    <a href="${ROOT}pages/services.html?cat=ebsd">EBSD测试分析</a>
                    <a href="${ROOT}pages/services.html?cat=ecci">ECCI分析</a>
                    <a href="${ROOT}pages/services.html?cat=postprocess">EBSD后处理</a>
                    <a href="${ROOT}pages/services.html?cat=advanced">高级分析</a>
                </div>
                <div class="footer-links">
                    <h4>帮助中心</h4>
                    <a href="#">送样指南</a>
                    <a href="#">常见问题</a>
                    <a href="#">报告样例</a>
                    <a href="#">发票说明</a>
                </div>
                <div class="footer-contact">
                    <h4>联系我们</h4>
                    <p><i class="fas fa-phone"></i> 400-888-9999</p>
                    <p><i class="fas fa-envelope"></i> service@kikuchi-lab.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> 北京市海淀区中关村科技园</p>
                    <p><i class="fas fa-clock"></i> 周一至周五 8:30-17:30</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 菊池实验室 KIKUCHI LAB. All Rights Reserved. | <a href="#">京ICP备XXXXXXXX号</a></p>
            </div>
        </div>
    </footer>`;
}

function renderChatWidget() {
    return `
    <div class="chat-widget" id="chatWidget">
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <span><i class="fas fa-headset"></i> 在线客服</span>
                <button class="chat-minimize" id="chatMinimize">&minus;</button>
            </div>
            <div class="chat-body" id="chatBody">
                <div class="chat-msg bot">
                    <div class="chat-avatar"><i class="fas fa-robot"></i></div>
                    <div class="chat-bubble">您好！请问需要什么帮助？</div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="输入您的问题...">
                <button id="chatSend"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
        <button class="chat-toggle" id="chatToggle"><i class="fas fa-headset"></i></button>
    </div>
    <button class="back-to-top" id="backToTop"><i class="fas fa-arrow-up"></i></button>`;
}

// ========== 公共交互 ==========
function initCommon() {
    // Navbar scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
    }
    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }));
    }
    // Chat
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatMin = document.getElementById('chatMinimize');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatBody = document.getElementById('chatBody');
    if (chatToggle) {
        chatToggle.addEventListener('click', () => chatWindow.classList.toggle('active'));
        chatMin.addEventListener('click', () => chatWindow.classList.remove('active'));
        const send = () => {
            const t = chatInput.value.trim(); if (!t) return;
            chatBody.innerHTML += `<div class="chat-msg user"><div class="chat-avatar"><i class="fas fa-user"></i></div><div class="chat-bubble">${t}</div></div>`;
            chatInput.value = '';
            setTimeout(() => {
                chatBody.innerHTML += `<div class="chat-msg bot"><div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-bubble">感谢咨询！请拨打 400-888-9999 或在线预约。</div></div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 600);
            chatBody.scrollTop = chatBody.scrollHeight;
        };
        chatSend.addEventListener('click', send);
        chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
    }
    // Back to top
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 300));
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    // Login button - check both new (kl_user) and old (rc_current_user) auth
    const loginBtn = document.getElementById('loginBtn');
    let user = null;
    try { user = JSON.parse(localStorage.getItem('kl_user')); } catch {}
    if (!user) try { user = JSON.parse(localStorage.getItem('rc_current_user')); } catch {}
    if (loginBtn && user) {
        loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.name}`;
    }
}
