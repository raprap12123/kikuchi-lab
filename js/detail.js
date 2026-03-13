// ========== 服务详情页逻辑 ==========

document.addEventListener('DOMContentLoaded', () => {
    // 注入公共组件
    document.getElementById('site-navbar').innerHTML = renderNavbar('services');
    document.getElementById('site-footer').innerHTML = renderFooter();
    document.getElementById('site-extras').innerHTML = renderChatWidget();
    initCommon();

    initDetailTabs();
    initDetailCalendar();
    initDetailBooking();
});

// ========== Tabs 切换 ==========
function initDetailTabs() {
    const tabs = document.querySelectorAll('.detail-tab');
    const panels = document.querySelectorAll('.detail-tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
    });
}

// ========== 预约日历 ==========
function initDetailCalendar() {
    const container = document.getElementById('detailCalendar');
    if (!container) return;
    const today = new Date();
    renderDetailCalendar(container, today.getFullYear(), today.getMonth());
}

function renderDetailCalendar(container, year, month) {
    const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const days = ['日','一','二','三','四','五','六'];
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 模拟已约时段
    const seed = year * 12 + month;
    const bookedDays = new Set();
    for (let i = 0; i < 5; i++) {
        bookedDays.add(((seed * 3 + i * 7) % daysInMonth) + 1);
    }

    let html = `
        <div class="calendar-header">
            <button class="cal-prev"><i class="fas fa-chevron-left"></i></button>
            <h5>${year}年${months[month]}</h5>
            <button class="cal-next"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-grid">
    `;
    days.forEach(d => html += `<div class="day-header">${d}</div>`);
    for (let i = 0; i < firstDay; i++) html += `<div class="day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
        const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let cls = 'day';
        if (isToday) cls += ' today';
        if (isPast || bookedDays.has(d)) {
            cls += ' booked';
        } else {
            cls += ' available';
        }
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        html += `<div class="${cls}" data-date="${dateStr}">${d}</div>`;
    }
    html += `</div>
        <div class="equip-legend" style="margin-top:12px;">
            <span><i class="legend-dot available"></i>可预约</span>
            <span><i class="legend-dot booked"></i>已约/过期</span>
        </div>`;

    container.innerHTML = html;

    // 翻页
    container.querySelector('.cal-prev').addEventListener('click', () => {
        const m = month === 0 ? 11 : month - 1;
        const y = month === 0 ? year - 1 : year;
        renderDetailCalendar(container, y, m);
    });
    container.querySelector('.cal-next').addEventListener('click', () => {
        const m = month === 11 ? 0 : month + 1;
        const y = month === 11 ? year + 1 : year;
        renderDetailCalendar(container, y, m);
    });

    // 点击可用日期
    container.querySelectorAll('.day.available').forEach(el => {
        el.addEventListener('click', () => {
            container.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
            const dateInput = document.getElementById('bookDate');
            if (dateInput) dateInput.value = el.dataset.date;
        });
    });
}

// ========== 预约表单 ==========
function initDetailBooking() {
    const form = document.getElementById('detailBookingForm');
    if (!form) return;

    // 自动填充已登录用户信息
    const user = JSON.parse(localStorage.getItem('rc_current_user'));
    if (user) {
        const n = form.querySelector('[name="bookName"]');
        const p = form.querySelector('[name="bookPhone"]');
        const o = form.querySelector('[name="bookOrg"]');
        if (n) n.value = user.name || '';
        if (p) p.value = user.phone || '';
        if (o) o.value = user.organization || '';
    }

    // 数量变化 → 更新总价
    const qtyInput = form.querySelector('[name="bookQty"]');
    const totalEl = document.getElementById('detailTotal');
    const unitPrice = parseInt(document.getElementById('detailUnitPrice')?.dataset.price || 0);

    if (qtyInput && totalEl) {
        qtyInput.addEventListener('input', () => {
            const qty = parseInt(qtyInput.value) || 1;
            totalEl.textContent = '¥' + (unitPrice * qty).toLocaleString();
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('rc_current_user'));
        if (!currentUser) {
            alert('请先注册登录后再预约');
            return;
        }
        const phone = form.querySelector('[name="bookPhone"]').value;
        if (!/^1\d{10}$/.test(phone)) {
            alert('请输入正确的手机号');
            return;
        }

        const orderNum = 'RC' + Date.now().toString(36).toUpperCase();
        const serviceName = document.getElementById('detailServiceName')?.textContent || '';
        const order = {
            id: orderNum,
            name: form.querySelector('[name="bookName"]').value,
            phone: phone,
            organization: form.querySelector('[name="bookOrg"]').value,
            service: serviceName,
            quantity: qtyInput?.value || 1,
            preferDate: form.querySelector('[name="bookDate"]')?.value || '',
            sampleInfo: form.querySelector('[name="bookNote"]')?.value || '',
            total: totalEl?.textContent || '',
            status: '待确认',
            createTime: new Date().toLocaleString('zh-CN')
        };

        let orders = JSON.parse(localStorage.getItem('rc_orders') || '[]');
        orders.push(order);
        localStorage.setItem('rc_orders', JSON.stringify(orders));

        alert(`预约成功！订单号：${orderNum}\n我们将在1个工作日内与您确认。`);
        form.reset();
    });
}
