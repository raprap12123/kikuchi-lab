// ========== Service Data ==========
const services = [
    // === EBSD抛光制样 ===
    {
        id: 'polish-mechanical',
        cat: 'polishing',
        name: '机械研磨 + OPS振动抛光',
        sub: '标准EBSD制样流程，逐级研磨至OPS胶体硅抛光，适用于大多数金属材料',
        icon: 'fa-gem',
        price: 200,
        unit: '/样',
        cycle: '1-2天',
        booked: 8432,
        satisfaction: 99.2,
        badge: null
    },
    {
        id: 'polish-cp',
        cat: 'polishing',
        name: '离子束截面抛光（CP）',
        sub: 'Ar离子束宽束抛光，获得无应力损伤的高质量表面，适用于多相/硬脆材料',
        icon: 'fa-bolt',
        price: 500,
        unit: '/样',
        cycle: '2-3天',
        booked: 5621,
        satisfaction: 99.5,
        badge: '热门'
    },
    {
        id: 'polish-fib',
        cat: 'polishing',
        name: '聚焦离子束抛光（FIB）',
        sub: 'Ga离子精确定位抛光，适用于微区域、界面、焊缝等特定位置的EBSD制样',
        icon: 'fa-crosshairs',
        price: 800,
        unit: '/样',
        cycle: '2-3天',
        booked: 3205,
        satisfaction: 99.1,
        badge: null
    },
    {
        id: 'polish-electro',
        cat: 'polishing',
        name: '电解抛光',
        sub: '电化学溶解去除表面应力层，适用于铝合金、不锈钢、铜合金等导电材料',
        icon: 'fa-bolt',
        price: 150,
        unit: '/样',
        cycle: '1天',
        booked: 4187,
        satisfaction: 99.0,
        badge: null
    },
    {
        id: 'polish-vibratory',
        cat: 'polishing',
        name: '长时振动抛光（8h+）',
        sub: '延长振动抛光时间获得极佳表面质量，适用于对标定率要求极高的研究',
        icon: 'fa-clock',
        price: 350,
        unit: '/样',
        cycle: '2-3天',
        booked: 2103,
        satisfaction: 99.6,
        badge: null
    },
    {
        id: 'polish-multi',
        cat: 'polishing',
        name: '多步复合抛光（机械+CP/FIB）',
        sub: '先机械预抛再离子束精修，兼顾效率与质量，适用于复杂多相/纳米晶材料',
        icon: 'fa-layer-group',
        price: 600,
        unit: '/样',
        cycle: '3-5天',
        booked: 1856,
        satisfaction: 99.4,
        badge: null
    },

    // === EBSD测试分析 ===
    {
        id: 'ebsd-standard',
        cat: 'ebsd',
        name: '标准EBSD扫描',
        sub: '单区域EBSD取向成像，提供IPF图、相图、晶界图、晶粒统计等基础数据',
        icon: 'fa-microscope',
        price: 500,
        unit: '/样',
        cycle: '3-5天',
        booked: 12530,
        satisfaction: 99.4,
        badge: '热门'
    },
    {
        id: 'ebsd-largemap',
        cat: 'ebsd',
        name: '大面积拼图EBSD扫描',
        sub: '多区域自动拼接，获取mm级别大视场取向图，适用于宏观组织/织构研究',
        icon: 'fa-expand',
        price: 800,
        unit: '/样',
        cycle: '5-7天',
        booked: 4328,
        satisfaction: 99.2,
        badge: null
    },
    {
        id: 'ebsd-texture',
        cat: 'ebsd',
        name: '织构分析（极图+ODF）',
        sub: 'EBSD数据提取极图、反极图、ODF截面，定量织构组分分析',
        icon: 'fa-circle-notch',
        price: 600,
        unit: '/样',
        cycle: '5-7天',
        booked: 6215,
        satisfaction: 99.3,
        badge: null
    },
    {
        id: 'ebsd-insitu',
        cat: 'ebsd',
        name: '原位加热EBSD',
        sub: '实时观测加热过程中的再结晶、相变、晶粒长大等动态行为',
        icon: 'fa-fire',
        price: 1500,
        unit: '/样',
        cycle: '7-10天',
        booked: 2103,
        satisfaction: 99.0,
        badge: null
    },
    {
        id: 'ebsd-tkd',
        cat: 'ebsd',
        name: 'TKD透射EBSD',
        sub: '透射菊池衍射，空间分辨率可达2-10nm，适用于纳米晶/薄膜/界面分析',
        icon: 'fa-atom',
        price: 1200,
        unit: '/样',
        cycle: '7-10天',
        booked: 1654,
        satisfaction: 98.9,
        badge: '高端'
    },
    {
        id: 'ebsd-hr',
        cat: 'ebsd',
        name: '高分辨EBSD（HR-EBSD）',
        sub: '基于交叉相关的高角分辨EBSD，测定弹性应变张量和GND密度',
        icon: 'fa-braille',
        price: 1800,
        unit: '/样',
        cycle: '10-15天',
        booked: 987,
        satisfaction: 99.1,
        badge: '独家'
    },

    // === ECCI分析 ===
    {
        id: 'ecci-standard',
        cat: 'ecci',
        name: 'ECCI位错成像',
        sub: '电子通道衬度成像，直接在SEM中观察位错/层错/孪晶等缺陷，无需TEM制样',
        icon: 'fa-eye',
        price: 600,
        unit: '/样',
        cycle: '3-5天',
        booked: 3542,
        satisfaction: 99.3,
        badge: '热门'
    },
    {
        id: 'ecci-controlled',
        cat: 'ecci',
        name: 'ECCI精确衍射条件控制',
        sub: '基于EBSD取向数据精确调控衍射条件，实现特定g矢量下的位错衬度成像',
        icon: 'fa-sliders-h',
        price: 1000,
        unit: '/样',
        cycle: '5-7天',
        booked: 1876,
        satisfaction: 99.0,
        badge: null
    },
    {
        id: 'ecci-virtual',
        cat: 'ecci',
        name: 'ECCI虚拟模拟',
        sub: '基于动力学衍射理论的ECCI图像模拟，辅助位错Burgers矢量鉴定与缺陷解析',
        icon: 'fa-laptop-code',
        price: 1500,
        unit: '/次',
        cycle: '7-10天',
        booked: 856,
        satisfaction: 99.5,
        badge: '独家'
    },
    {
        id: 'ecci-ebsd-combo',
        cat: 'ecci',
        name: 'EBSD+ECCI联合分析',
        sub: '同一区域先EBSD获取取向信息，再ECCI观察位错结构，取向-缺陷一一对应',
        icon: 'fa-link',
        price: 1200,
        unit: '/样',
        cycle: '5-7天',
        booked: 2340,
        satisfaction: 99.2,
        badge: null
    },

    // === EBSD后处理 ===
    {
        id: 'post-kam',
        cat: 'postprocess',
        name: 'KAM / GOS / GAM 分析',
        sub: '核平均取向差、晶粒取向展布、晶粒平均取向差分析，表征应变/变形程度',
        icon: 'fa-chart-area',
        price: 300,
        unit: '/样',
        cycle: '2-3天',
        booked: 7832,
        satisfaction: 99.4,
        badge: null
    },
    {
        id: 'post-gnd',
        cat: 'postprocess',
        name: 'GND几何必需位错密度计算',
        sub: '基于取向梯度计算GND密度分布，定量表征材料中的位错存储',
        icon: 'fa-wave-square',
        price: 500,
        unit: '/样',
        cycle: '3-5天',
        booked: 4521,
        satisfaction: 99.1,
        badge: '热门'
    },
    {
        id: 'post-recrystallization',
        cat: 'postprocess',
        name: '再结晶分数统计',
        sub: '基于GOS/KAM阈值区分再结晶/亚结构/变形晶粒，定量统计各组分比例',
        icon: 'fa-chart-pie',
        price: 300,
        unit: '/样',
        cycle: '2-3天',
        booked: 3654,
        satisfaction: 99.3,
        badge: null
    },
    {
        id: 'post-gb',
        cat: 'postprocess',
        name: '晶界特征分布（GBCD）分析',
        sub: 'CSL特殊晶界识别、晶界取向差分布、Σ值统计、晶界网络连通性分析',
        icon: 'fa-project-diagram',
        price: 400,
        unit: '/样',
        cycle: '3-5天',
        booked: 2987,
        satisfaction: 99.0,
        badge: null
    },
    {
        id: 'post-schmid',
        cat: 'postprocess',
        name: 'Schmid因子分析',
        sub: '基于EBSD取向数据计算各滑移系的Schmid因子分布，预测塑性变形行为',
        icon: 'fa-arrows-alt',
        price: 400,
        unit: '/样',
        cycle: '3-5天',
        booked: 2156,
        satisfaction: 99.2,
        badge: null
    },
    {
        id: 'post-parent',
        cat: 'postprocess',
        name: '母相重构（Parent Grain Reconstruction）',
        sub: '基于OR关系从子相EBSD数据反推母相取向，适用于马氏体/贝氏体钢等相变材料',
        icon: 'fa-undo-alt',
        price: 800,
        unit: '/样',
        cycle: '5-7天',
        booked: 1543,
        satisfaction: 98.8,
        badge: null
    },

    // === 高级分析 ===
    {
        id: 'adv-spherical',
        cat: 'advanced',
        name: '球形标定（Spherical Indexing）',
        sub: '基于球谐函数的EBSD标定方法，突破传统Hough变换局限，提升低对称/多相标定率',
        icon: 'fa-globe',
        price: 1000,
        unit: '/样',
        cycle: '5-7天',
        booked: 1234,
        satisfaction: 99.5,
        badge: '独家'
    },
    {
        id: 'adv-dictionary',
        cat: 'advanced',
        name: '字典标定（Dictionary Indexing）',
        sub: '预计算花样数据库逐一匹配，比Hough更准确，适用于高变形/低信噪比数据',
        icon: 'fa-book',
        price: 1200,
        unit: '/样',
        cycle: '7-10天',
        booked: 987,
        satisfaction: 99.3,
        badge: '独家'
    },
    {
        id: 'adv-slip',
        cat: 'advanced',
        name: '滑移系分析与活化识别',
        sub: '结合取向数据与力学条件识别活化滑移系，分析变形机制与滑移迹线',
        icon: 'fa-random',
        price: 800,
        unit: '/样',
        cycle: '5-7天',
        booked: 1567,
        satisfaction: 99.1,
        badge: null
    },
    {
        id: 'adv-mprime',
        cat: 'advanced',
        name: '几何相容因子（m\'）计算',
        sub: '量化相邻晶粒间滑移传递的几何相容性，预测裂纹萌生与疲劳行为',
        icon: 'fa-bezier-curve',
        price: 800,
        unit: '/样',
        cycle: '5-7天',
        booked: 1123,
        satisfaction: 99.4,
        badge: '独家'
    },
    {
        id: 'adv-taylor',
        cat: 'advanced',
        name: 'Taylor因子与塑性功分析',
        sub: 'Full constraints / Relaxed constraints Taylor模型，预测多晶塑性各向异性',
        icon: 'fa-cubes',
        price: 600,
        unit: '/样',
        cycle: '5-7天',
        booked: 876,
        satisfaction: 99.0,
        badge: null
    },
    {
        id: 'adv-or',
        cat: 'advanced',
        name: '取向关系（OR）精确测定',
        sub: '精确测定相变材料中母/子相取向关系（K-S/N-W/Pitsch等），偏差角统计分析',
        icon: 'fa-exchange-alt',
        price: 600,
        unit: '/样',
        cycle: '5-7天',
        booked: 1045,
        satisfaction: 99.2,
        badge: null
    },
    {
        id: 'adv-strain',
        cat: 'advanced',
        name: '应变分区与变形带分析',
        sub: '基于取向梯度识别变形带/剪切带/转动区域，量化局部应变分配',
        icon: 'fa-compress-arrows-alt',
        price: 500,
        unit: '/样',
        cycle: '3-5天',
        booked: 1320,
        satisfaction: 99.1,
        badge: null
    },
    {
        id: 'adv-custom',
        cat: 'advanced',
        name: '定制化EBSD数据分析',
        sub: '根据您的具体科研需求定制MTEX/OIM/ATEX/Dream3D等脚本与分析流程',
        icon: 'fa-code',
        price: 2000,
        unit: '/次起',
        cycle: '协商',
        booked: 654,
        satisfaction: 99.8,
        badge: '定制'
    }
];

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
    initCounts();
    initCategoryNav();
    initSearch();
    initChat();
    initBackToTop();
    initNavbar();

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) {
        selectCategory(cat);
    } else {
        renderServices('all');
    }
});

// ========== Count badges ==========
function initCounts() {
    const cats = {};
    services.forEach(s => {
        cats[s.cat] = (cats[s.cat] || 0) + 1;
    });
    document.getElementById('countAll').textContent = services.length;
    document.getElementById('countPolishing').textContent = cats.polishing || 0;
    document.getElementById('countEbsd').textContent = cats.ebsd || 0;
    document.getElementById('countEcci').textContent = cats.ecci || 0;
    document.getElementById('countPostprocess').textContent = cats.postprocess || 0;
    document.getElementById('countAdvanced').textContent = cats.advanced || 0;
}

// ========== Category Navigation ==========
function initCategoryNav() {
    document.querySelectorAll('.svc-cat').forEach(el => {
        el.addEventListener('click', () => {
            selectCategory(el.dataset.cat);
        });
    });
}

function selectCategory(cat) {
    document.querySelectorAll('.svc-cat').forEach(el => {
        el.classList.toggle('active', el.dataset.cat === cat);
    });

    const titles = {
        all: 'EBSD抛光与分析服务',
        polishing: 'EBSD抛光制样',
        ebsd: 'EBSD测试分析',
        ecci: 'ECCI分析',
        postprocess: 'EBSD后处理',
        advanced: '高级分析'
    };
    const descs = {
        all: '专注EBSD全流程服务：从样品制备到数据深度分析，提供MTEX/OIM无法实现的高级表征方案',
        polishing: '专业EBSD样品制备，确保表面零应力损伤，获得最高标定率',
        ebsd: '配备Oxford/EDAX高端EBSD系统，标定率>95%，提供全套取向分析数据',
        ecci: '电子通道衬度成像，SEM下直接观察位错缺陷，免去TEM制样',
        postprocess: 'EBSD数据深度挖掘，KAM/GND/再结晶/晶界等定量分析',
        advanced: '球形标定、字典标定、滑移分析、几何相容因子等MTEX/OIM之外的独家能力'
    };

    document.getElementById('svcTitle').textContent = titles[cat] || titles.all;
    document.getElementById('svcDesc').textContent = descs[cat] || descs.all;

    renderServices(cat);
}

// ========== Render Services ==========
function renderServices(cat, searchTerm) {
    const grid = document.getElementById('svcGrid');
    let filtered = services;

    if (cat && cat !== 'all') {
        filtered = filtered.filter(s => s.cat === cat);
    }

    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.sub.toLowerCase().includes(q) ||
            s.cat.toLowerCase().includes(q)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><p>未找到匹配的服务项目</p></div>`;
        return;
    }

    // Map id to detail page
    const detailPages = {
        'polish-mechanical': 'services/polish-ops.html',
        'polish-cp': 'services/polish-cp.html',
        'polish-fib': 'services/polish-fib.html',
        'polish-electro': 'services/polish-electro.html',
        'polish-vibratory': 'services/polish-vibratory.html',
        'polish-multi': 'services/polish-multi.html',
        'ebsd-standard': 'services/ebsd-standard.html',
        'ebsd-largemap': 'services/ebsd-largemap.html',
        'ebsd-texture': 'services/ebsd-texture.html',
        'ebsd-insitu': 'services/ebsd-insitu.html',
        'ebsd-tkd': 'services/ebsd-tkd.html',
        'ebsd-hr': 'services/ebsd-hr.html',
        'ecci-standard': 'services/ecci-standard.html',
        'ecci-controlled': 'services/ecci-controlled.html',
        'ecci-virtual': 'services/ecci-virtual.html',
        'ecci-ebsd-combo': 'services/ecci-ebsd-combo.html',
        'post-kam': 'services/post-kam.html',
        'post-gnd': 'services/post-gnd.html',
        'post-recrystallization': 'services/post-recrystallization.html',
        'post-gb': 'services/post-gb.html',
        'post-schmid': 'services/post-schmid.html',
        'post-parent': 'services/post-parent.html',
        'adv-spherical': 'services/adv-spherical.html',
        'adv-dictionary': 'services/adv-dictionary.html',
        'adv-slip': 'services/adv-slip.html',
        'adv-mprime': 'services/adv-mprime.html',
        'adv-taylor': 'services/adv-taylor.html',
        'adv-or': 'services/adv-or.html',
        'adv-strain': 'services/adv-strain.html',
        'adv-custom': 'services/adv-custom.html',
    };

    grid.innerHTML = filtered.map(s => {
        const pageUrl = detailPages[s.id] ? detailPages[s.id] : null;
        const linkStart = pageUrl ? `<a href="${pageUrl}" class="svc-product-link">` : '';
        const linkEnd = pageUrl ? '</a>' : '';

        return `
        ${linkStart}
        <div class="svc-product" data-cat="${s.cat}">
            ${s.badge ? `<div class="svc-product-badge">${s.badge}</div>` : ''}
            <div class="svc-product-img">
                <div class="img-bg"><i class="fas ${s.icon}"></i></div>
                <span class="svc-product-tag">${getCatName(s.cat)}</span>
            </div>
            <div class="svc-product-body">
                <div class="svc-product-name">${s.name}</div>
                <div class="svc-product-sub">${s.sub}</div>
                <div class="svc-product-stats">
                    <div class="svc-stat">
                        <span class="svc-stat-value">${s.cycle}</span>
                        <span class="svc-stat-label">平均周期</span>
                    </div>
                    <div class="svc-stat">
                        <span class="svc-stat-value">${s.booked.toLocaleString()}</span>
                        <span class="svc-stat-label">已预约</span>
                    </div>
                    <div class="svc-stat">
                        <span class="svc-stat-value">${s.satisfaction}%</span>
                        <span class="svc-stat-label">满意度</span>
                    </div>
                </div>
                <div class="svc-product-footer">
                    <div class="svc-price">¥${s.price.toLocaleString()}<small>${s.unit}</small></div>
                    <span class="btn btn-primary btn-sm">${pageUrl ? '查看详情' : '立即咨询'}</span>
                </div>
            </div>
        </div>
        ${linkEnd}`;
    }).join('');
}

function getCatName(cat) {
    const names = {
        polishing: '抛光制样',
        ebsd: 'EBSD测试',
        ecci: 'ECCI分析',
        postprocess: '后处理',
        advanced: '高级分析'
    };
    return names[cat] || cat;
}

// ========== Search ==========
function initSearch() {
    const input = document.getElementById('serviceSearch');
    let debounce;

    input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            const q = input.value.trim();
            // Reset category to all when searching
            document.querySelectorAll('.svc-cat').forEach(el => {
                el.classList.toggle('active', el.dataset.cat === 'all');
            });
            renderServices('all', q);
        }, 300);
    });

    // Hot search links
    document.querySelectorAll('.hot-search a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            input.value = a.dataset.search;
            input.dispatchEvent(new Event('input'));
        });
    });
}

// ========== Chat (simplified) ==========
function initChat() {
    const toggle = document.getElementById('chatToggle');
    const win = document.getElementById('chatWindow');
    const minimize = document.getElementById('chatMinimize');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const body = document.getElementById('chatBody');

    toggle.addEventListener('click', () => win.classList.toggle('active'));
    minimize.addEventListener('click', () => win.classList.remove('active'));

    function send() {
        const text = input.value.trim();
        if (!text) return;
        body.innerHTML += `<div class="chat-msg user"><div class="chat-avatar"><i class="fas fa-user"></i></div><div class="chat-bubble">${text}</div></div>`;
        input.value = '';
        setTimeout(() => {
            body.innerHTML += `<div class="chat-msg bot"><div class="chat-avatar"><i class="fas fa-robot"></i></div><div class="chat-bubble">感谢咨询！可拨打 400-888-9999 或直接在线预约。</div></div>`;
            body.scrollTop = body.scrollHeight;
        }, 600);
        body.scrollTop = body.scrollHeight;
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
}

// ========== Back to Top ==========
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== Navbar ==========
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
