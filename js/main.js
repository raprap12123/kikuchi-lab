// ========== DOM Ready ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initCountUp();
    initAuthModal();
    initChatWidget();
    initFloatingToolbar();
    initPromoBanner();
    initHeroSearch();
    initArticleTabs();
    initUserCenter();
    initRecharge();
    initSideFloats();
});

// ========== Navbar ==========
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        // Lock body scroll when mobile menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // 点击导航链接关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== Particles ==========
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
        container.appendChild(p);
    }
}

// ========== Counter Animation ==========
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const decimal = parseInt(el.dataset.decimal) || 0;
                animateCount(el, target, decimal);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCount(el, target, decimal) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        if (decimal > 0) {
            el.textContent = current.toFixed(decimal);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ========== Equipment Calendar ==========
function initCalendars() {
    const calendarIds = ['calendar-sem1', 'calendar-sem2', 'calendar-cp', 'calendar-xrd']; // xrd now = vibro polisher
    const today = new Date();

    calendarIds.forEach((id, idx) => {
        renderCalendar(id, today.getFullYear(), today.getMonth(), idx);
    });
}

function renderCalendar(containerId, year, month, equipIdx) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const days = ['日','一','二','三','四','五','六'];
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 模拟预约数据
    const seed = equipIdx * 7 + month;
    const bookedDays = new Set();
    const maintenanceDays = new Set();
    for (let i = 0; i < 6; i++) {
        bookedDays.add(((seed * 3 + i * 5) % daysInMonth) + 1);
    }
    // no maintenance days by default

    let html = `
        <div class="calendar-header">
            <button class="cal-prev" data-container="${containerId}" data-equip="${equipIdx}"
                data-year="${month === 0 ? year - 1 : year}" data-month="${month === 0 ? 11 : month - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h5>${year}年${months[month]}</h5>
            <button class="cal-next" data-container="${containerId}" data-equip="${equipIdx}"
                data-year="${month === 11 ? year + 1 : year}" data-month="${month === 11 ? 0 : month + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="calendar-grid">
    `;

    days.forEach(d => html += `<div class="day-header">${d}</div>`);

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
        const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let cls = 'day';
        if (isToday) cls += ' today';
        if (maintenanceDays.has(d)) {
            cls += ' maintenance';
        } else if (isPast || bookedDays.has(d)) {
            cls += ' booked';
        } else {
            cls += ' available';
        }
        html += `<div class="${cls}" data-date="${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}">${d}</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    // 绑定翻页
    container.querySelectorAll('.cal-prev, .cal-next').forEach(btn => {
        btn.addEventListener('click', () => {
            renderCalendar(btn.dataset.container, parseInt(btn.dataset.year), parseInt(btn.dataset.month), parseInt(btn.dataset.equip));
        });
    });

    // 点击可预约日期
    container.querySelectorAll('.day.available').forEach(day => {
        day.addEventListener('click', () => {
            const dateInput = document.querySelector('input[name="preferDate"]');
            if (dateInput) {
                dateInput.value = day.dataset.date;
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========== Auth Modal ==========
function initAuthModal() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.getElementById('modalClose');
    const tabs = modal.querySelectorAll('.modal-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const sendSmsBtn = document.getElementById('sendSms');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    // Mobile tab bar "我的" button
    const mobileLoginTab = document.getElementById('mobileLoginTab');
    if (mobileLoginTab) {
        mobileLoginTab.addEventListener('click', (e) => {
            e.preventDefault();
            const cachedUser = getCachedUser();
            if (cachedUser && isLoggedIn()) {
                openUserCenter();
            } else {
                modal.classList.add('active');
            }
        });
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });

    // 发送验证码（调用后端API）
    let smsTimer = 0;
    sendSmsBtn.addEventListener('click', async () => {
        const phone = registerForm.querySelector('input[name="regPhone"]').value;
        if (!/^1\d{10}$/.test(phone)) {
            showToast('请输入正确的手机号', 'error');
            return;
        }
        if (smsTimer > 0) return;

        sendSmsBtn.disabled = true;
        sendSmsBtn.textContent = '发送中...';

        try {
            const data = await sendSmsCode(phone);
            smsTimer = 60;
            sendSmsBtn.textContent = `${smsTimer}s`;
            const interval = setInterval(() => {
                smsTimer--;
                sendSmsBtn.textContent = smsTimer > 0 ? `${smsTimer}s` : '发送验证码';
                if (smsTimer <= 0) {
                    clearInterval(interval);
                    sendSmsBtn.disabled = false;
                }
            }, 1000);

            // 演示模式：如果API返回了验证码，自动填入
            if (data.code) {
                registerForm.querySelector('input[name="smsCode"]').value = data.code;
                showToast('验证码已发送（演示模式已自动填入）', 'success');
            } else {
                showToast('验证码已发送到您的手机', 'success');
            }
        } catch (err) {
            sendSmsBtn.disabled = false;
            sendSmsBtn.textContent = '发送验证码';
            showToast(err.message || '发送失败，请重试', 'error');
        }
    });

    // 登录（调用后端API，密码安全验证）
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = loginForm.querySelector('input[name="account"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = '登录中...';

        try {
            const data = await loginUser(phone, password);
            modal.classList.remove('active');
            updateUserUI(data.user);
            showToast('登录成功！欢迎回来，' + data.user.name, 'success');
        } catch (err) {
            showToast(err.message || '账号或密码错误', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '登录';
        }
    });

    // 注册（调用后端API，密码bcrypt加密存储）
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('input[name="regName"]').value;
        const phone = registerForm.querySelector('input[name="regPhone"]').value;
        const smsCode = registerForm.querySelector('input[name="smsCode"]').value;
        const organization = registerForm.querySelector('input[name="regOrg"]').value;
        const email = registerForm.querySelector('input[name="regEmail"]').value;
        const password = registerForm.querySelector('input[name="regPassword"]').value;

        if (password.length < 8) {
            showToast('密码至少8位', 'error');
            return;
        }
        if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
            showToast('密码需包含字母和数字', 'error');
            return;
        }

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '注册中...';

        try {
            const data = await registerUser({ name, phone, smsCode, organization, email, password });
            modal.classList.remove('active');
            updateUserUI(data.user);
            showToast('注册成功！欢迎，' + data.user.name, 'success');
        } catch (err) {
            showToast(err.message || '注册失败，请重试', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '注册';
        }
    });

    // 检查是否已登录（使用新的token机制）
    const cachedUser = getCachedUser();
    if (cachedUser && isLoggedIn()) {
        updateUserUI(cachedUser);
    }
}

// ===== Toast 提示（替代 alert） =====
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateUserUI(user) {
    if (!user) return;
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.name}`;
    loginBtn.onclick = () => {
        openUserCenter();
    };

    // 自动填充预约表单
    const nameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const orgInput = document.querySelector('input[name="organization"]');
    const emailInput = document.querySelector('input[name="email"]');
    if (nameInput && !nameInput.value) nameInput.value = user.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
    if (orgInput && !orgInput.value) orgInput.value = user.organization || '';
    if (emailInput && !emailInput.value) emailInput.value = user.email || '';
}

// ========== Chat Widget ==========
function initChatWidget() {
    const chatWindow = document.getElementById('chatWindow');
    const minimize = document.getElementById('chatMinimize');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const body = document.getElementById('chatBody');

    if (!chatWindow || !minimize || !input || !sendBtn || !body) return;

    minimize.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    function addMessage(text, isUser) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
        msg.innerHTML = `
            <div class="chat-avatar"><i class="fas fa-${isUser ? 'user' : 'robot'}"></i></div>
            <div class="chat-bubble">${text}</div>
        `;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }

    function botReply(userMsg) {
        const replies = {
            '流程': 'EBSD测试流程：<br>1. 在线提交预约<br>2. 寄送/自送样品<br>3. 技术员进行抛光+扫描<br>4. 数据处理与分析<br>5. 报告交付（邮件+快递）<br><br>整个流程约5-7个工作日。',
            '送样': '送样要求：<br>- 金属样品建议尺寸 ≤ 20×20×10mm<br>- 做好防震防潮包装<br>- 随附样品信息表（可在预约后下载）<br>- 危险/放射性样品请提前告知<br><br>地址：北京市海淀区中关村科技园',
            '时间': '常规EBSD测试约5-7个工作日出结果。<br>加急服务可在3个工作日内完成（加收30%费用）。<br>具体以样品复杂程度为准。',
            '人工': '正在为您转接人工客服...<br><br>您也可以直接拨打电话：<strong>400-888-9999</strong><br>或添加微信客服咨询。',
            '价格': '我们的价格固定透明，您可以在价格表页面查看所有服务项目的具体价格。<br>批量送样（≥10样）享9折优惠。',
        };

        setTimeout(() => {
            let reply = '感谢您的咨询！您可以查看我们的服务页面了解详细信息，或拨打 400-888-9999 咨询人工客服。';
            for (const [key, val] of Object.entries(replies)) {
                if (userMsg.includes(key)) {
                    reply = val;
                    break;
                }
            }
            addMessage(reply, false);
        }, 800);
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, true);
        input.value = '';
        botReply(text);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // 快速回复
    body.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            const msg = e.target.dataset.msg;
            addMessage(msg, true);
            botReply(msg);
        }
    });
}

// ========== Floating Toolbar ==========
function initFloatingToolbar() {
    const chatBtn = document.getElementById('toolbarChat');
    const backTopBtn = document.getElementById('toolbarBackTop');
    const chatWindow = document.getElementById('chatWindow');

    if (chatBtn && chatWindow) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
    }

    if (backTopBtn) {
        backTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========== Promotional Banner Carousel ==========
function initPromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;

    const slides = banner.querySelectorAll('.promo-slide');
    const dots = banner.querySelectorAll('.promo-dot');
    const closeBtn = document.getElementById('promoClose');
    let currentIndex = 0;
    let interval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % slides.length);
    }

    function startAutoRotate() {
        interval = setInterval(nextSlide, 4000);
    }

    function stopAutoRotate() {
        clearInterval(interval);
    }

    // Dot click navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoRotate();
            goToSlide(parseInt(dot.dataset.index));
            startAutoRotate();
        });
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            banner.classList.add('hidden');
            stopAutoRotate();
        });
    }

    // Pause on hover
    banner.addEventListener('mouseenter', stopAutoRotate);
    banner.addEventListener('mouseleave', startAutoRotate);

    startAutoRotate();
}

// ========== Animated Hero Search Placeholder ==========
function initHeroSearch() {
    const input = document.getElementById('heroSearchInput');
    const placeholder = document.getElementById('heroSearchPlaceholder');
    if (!input || !placeholder) return;

    const texts = ['EBSD抛光', 'ECCI位错成像', '球形标定', '织构分析', 'KAM分析'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    function type() {
        // Hide animated placeholder when user is typing
        if (input.value.length > 0) {
            placeholder.classList.add('hidden');
            return;
        }
        placeholder.classList.remove('hidden');

        const currentText = texts[textIndex];

        if (isDeleting) {
            placeholder.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 60;
        } else {
            placeholder.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 300;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing animation
    type();

    // Hide placeholder when input is focused and has text
    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            placeholder.classList.add('hidden');
        }
    });

    input.addEventListener('focus', () => {
        if (input.value.length > 0) {
            placeholder.classList.add('hidden');
        }
    });

    input.addEventListener('blur', () => {
        if (input.value.length === 0) {
            placeholder.classList.remove('hidden');
        }
    });
}

// ========== Article Tabs ==========
function initArticleTabs() {
    const tabs = document.querySelectorAll('.article-tab');
    const cards = document.querySelectorAll('.article-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.category;
            cards.forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ========== User Center ==========
function initUserCenter() {
    const modal = document.getElementById('userCenterModal');
    const closeBtn = document.getElementById('ucClose');
    const logoutBtn = document.getElementById('logoutBtn');
    const navItems = modal.querySelectorAll('.uc-nav-item');
    const panels = modal.querySelectorAll('.uc-panel');
    const orderFilters = modal.querySelectorAll('.order-filter');

    // Close
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // Nav
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + item.dataset.panel).classList.add('active');
        });
    });

    // Order filters
    orderFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            orderFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOrders(btn.dataset.status);
        });
    });

    // Logout（清除token和用户缓存）
    logoutBtn.addEventListener('click', () => {
        logout(); // 调用 auth.js 的 logout()
        modal.classList.remove('active');
        location.reload();
    });

    // Profile form（调用后端API更新）
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const updated = await updateProfile({
                name: document.getElementById('profileName').value,
                organization: document.getElementById('profileOrg').value,
                email: document.getElementById('profileEmail').value
            });
            showToast('信息已更新！', 'success');
        } catch (err) {
            showToast(err.message || '更新失败', 'error');
        }
    });
}

async function openUserCenter() {
    const user = getCachedUser();
    if (!user) return;

    document.getElementById('ucName').textContent = user.name;
    document.getElementById('ucOrg').textContent = user.organization || '';
    document.getElementById('ucBalance').textContent = '¥' + (user.balance || 0).toLocaleString();

    // Profile form
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profilePhone').value = user.phone || '';
    document.getElementById('profileOrg').value = user.organization || '';
    document.getElementById('profileEmail').value = user.email || '';

    // 从后端获取订单
    await renderOrders('all');
    renderRechargeHistory();
    document.getElementById('userCenterModal').classList.add('active');
}

async function renderOrders(statusFilter) {
    const list = document.getElementById('orderList');

    // 从后端API获取订单
    let orders = [];
    try {
        orders = await getMyOrders();
    } catch {
        orders = [];
    }

    if (statusFilter !== 'all') {
        orders = orders.filter(o => o.status === statusFilter);
    }

    if (orders.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>暂无订单记录</p></div>';
        return;
    }

    list.innerHTML = orders.reverse().map(o => {
        let statusClass = 'status-pending';
        if (o.status === '测试中') statusClass = 'status-testing';
        if (o.status === '已完成') statusClass = 'status-done';

        return `<div class="order-item">
            <div class="order-item-header">
                <span class="order-item-id">${o.id}</span>
                <span class="order-status ${statusClass}">${o.status}</span>
            </div>
            <div class="order-item-info">
                <span><i class="fas fa-flask"></i> ${o.service}</span>
                <span><i class="fas fa-sort-numeric-up"></i> ${o.quantity}样</span>
                <span><i class="fas fa-yen-sign"></i> ${o.total}</span>
                <span><i class="fas fa-clock"></i> ${o.createTime}</span>
            </div>
        </div>`;
    }).join('');
}

function renderRechargeHistory() {
    const list = document.getElementById('rechargeList');
    const user = JSON.parse(localStorage.getItem('rc_current_user'));
    let records = JSON.parse(localStorage.getItem('rc_recharge') || '[]');

    if (user) {
        records = records.filter(r => r.phone === user.phone);
    }

    if (records.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-wallet"></i><p>暂无充值记录</p></div>';
        return;
    }

    list.innerHTML = records.reverse().map(r => `
        <div class="order-item">
            <div class="order-item-header">
                <span class="order-item-id">充值 ¥${r.amount.toLocaleString()}</span>
                <span class="order-status status-done">赠送 ¥${r.bonus}</span>
            </div>
            <div class="order-item-info">
                <span><i class="fas fa-clock"></i> ${r.time}</span>
                <span><i class="fas fa-wallet"></i> 余额 ¥${r.balanceAfter.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// ========== Side Floating Ads & Mobile Promo Bar ==========
function initSideFloats() {
    // Check 24-hour hide for all closeable promos
    const promoEls = document.querySelectorAll('.side-float, .mobile-promo-bar');
    promoEls.forEach(el => {
        const id = el.id;
        const closedAt = localStorage.getItem('sf_closed_' + id);
        if (closedAt && Date.now() - parseInt(closedAt) < 24 * 60 * 60 * 1000) {
            el.style.display = 'none';
            if (el.classList.contains('mobile-promo-bar')) {
                document.body.style.paddingBottom = '0';
            }
        }
    });

    // Close buttons for both desktop floats and mobile bar
    document.querySelectorAll('.side-float-close, .mobile-promo-bar-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) {
                target.style.display = 'none';
                localStorage.setItem('sf_closed_' + btn.dataset.target, Date.now().toString());
                if (target.classList.contains('mobile-promo-bar')) {
                    document.body.style.paddingBottom = '0';
                }
            }
        });
    });
}

// ========== Recharge ==========
function initRecharge() {
    document.querySelectorAll('.btn-recharge').forEach(btn => {
        btn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('rc_current_user'));
            if (!user) {
                alert('请先登录后再充值');
                document.getElementById('authModal').classList.add('active');
                return;
            }

            const amount = parseInt(btn.dataset.amount);
            const bonus = parseInt(btn.dataset.bonus);

            if (!confirm(`确认充值 ¥${amount.toLocaleString()}？将额外赠送 ¥${bonus}`)) return;

            // Update user balance
            user.balance = (user.balance || 0) + amount + bonus;
            localStorage.setItem('rc_current_user', JSON.stringify(user));

            // Update users list
            let users = JSON.parse(localStorage.getItem('rc_users') || '[]');
            const idx = users.findIndex(u => u.phone === user.phone);
            if (idx >= 0) { users[idx] = user; }
            localStorage.setItem('rc_users', JSON.stringify(users));

            // Save recharge record
            let records = JSON.parse(localStorage.getItem('rc_recharge') || '[]');
            records.push({
                phone: user.phone,
                amount: amount,
                bonus: bonus,
                balanceAfter: user.balance,
                time: new Date().toLocaleString('zh-CN')
            });
            localStorage.setItem('rc_recharge', JSON.stringify(records));

            alert(`充值成功！已到账 ¥${(amount + bonus).toLocaleString()}，当前余额 ¥${user.balance.toLocaleString()}`);
        });
    });
}
