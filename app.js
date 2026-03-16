window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
    initNav();
    initNavHoverEffect();
    initCopyBtn();
    initMobileMenu();
    initAuthTabs();
    injectStore();
    initSession();
    initRouting();
});

function initRouting() {
    const pathMap = {
        '/magaza': { view: 'store' },
        '/bakiye': { view: 'bakiye' },
        '/bilgiler': { view: 'bilgiler' },
        '/kurallar': { view: 'kurallar' },
        '/giris': { view: 'auth', auth: 'login' },
        '/kayit': { view: 'auth', auth: 'register' }
    };
    const path = window.location.pathname;
    const entry = pathMap[path];
    if (entry) {
        revealView(entry.view, entry.auth || null);
    } else {
        revealView('home');
    }
}

function revealView(target, authType) {
    document.querySelectorAll('.view-section').forEach(s => {
        s.classList.remove('active');
        s.style.cssText = 'display:none;';
    });
    const el = document.getElementById('view-' + target);
    if (el) {
        const d = target === 'auth' ? 'flex' : 'block';
        el.style.cssText = `display:${d};opacity:1;transform:none;`;
        el.classList.add('active');
    }
    currentView = target;
    updateNavActive(target);
    if (target === 'auth' && authType) switchAuthTab(authType);
    if (window.lucide) window.lucide.createIcons();
}

let currentView = 'home';

function initNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const target = btn.dataset.target;
        if (!target) return;
        btn.addEventListener('click', () => {
            closeMobileMenu();
            showView(target, btn.dataset.auth || null, btn.dataset.scroll || null);
        });
    });
    document.getElementById('nav-logo')?.addEventListener('click', () => showView('home'));
}

function showView(target, authType, scrollTarget) {
    if (target === currentView && !scrollTarget && !authType) return;

    const leaving = document.getElementById('view-' + currentView);
    if (leaving) {
        leaving.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
        leaving.style.opacity = '0';
        leaving.style.transform = 'translateY(-6px)';
    }

    setTimeout(() => {
        document.querySelectorAll('.view-section').forEach(s => {
            s.classList.remove('active');
            s.style.cssText = 'display:none;';
        });

        const el = document.getElementById('view-' + target);
        if (el) {
            const d = target === 'auth' ? 'flex' : 'block';
            el.style.cssText = `display:${d};opacity:0;transform:translateY(10px);transition:opacity 0.28s ease,transform 0.28s ease;`;
            el.classList.add('active');
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }));
        }

        currentView = target;
        updateNavActive(target, scrollTarget);

        const urlMap = { home: '/', store: '/magaza', bakiye: '/bakiye', bilgiler: '/bilgiler', kurallar: '/kurallar', auth: authType === 'register' ? '/kayit' : '/giris' };
        history.replaceState(null, '', urlMap[target] || '/' + target);

        if (target === 'auth' && authType) switchAuthTab(authType);

        if (scrollTarget) {
            setTimeout(() => {
                const sec = document.getElementById('section-' + scrollTarget);
                if (sec) {
                    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    sec.classList.add('highlight');
                    setTimeout(() => sec.classList.remove('highlight'), 1200);
                }
            }, 320);
        }

        if (window.lucide) window.lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 165);
}

function updateNavActive(target, scrollTarget) {
    document.querySelectorAll('.nav-underline').forEach(btn => {
        const same = btn.dataset.target === target && (scrollTarget ? btn.dataset.scroll === scrollTarget : !btn.dataset.scroll);
        btn.classList.toggle('active', same);
        btn.style.color = same ? 'white' : '';
    });
}

function initNavHoverEffect() {
    const btns = document.querySelectorAll('.nav-underline');
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => btns.forEach(b => { if (b !== btn) b.classList.add('hover-suppressed'); }));
        btn.addEventListener('mouseleave', () => btns.forEach(b => b.classList.remove('hover-suppressed')));
    });
}

function initCopyBtn() {
    const btn = document.getElementById('copy-ip-btn');
    const toast = document.getElementById('copy-toast');
    let timer;
    btn?.addEventListener('click', () => {
        navigator.clipboard.writeText('oyna.oldfinecraft.online').then(() => {
            clearTimeout(timer);
            toast.classList.add('show');
            timer = setTimeout(() => toast.classList.remove('show'), 2800);
        });
    });
}

function initMobileMenu() {
    document.getElementById('hamburger-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-drawer').classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    document.getElementById('mobile-overlay')?.addEventListener('click', closeMobileMenu);
}
function openMobileMenu() {
    document.getElementById('hamburger-btn').classList.add('open');
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('mobile-overlay').classList.add('open');
}
function closeMobileMenu() {
    document.getElementById('hamburger-btn')?.classList.remove('open');
    document.getElementById('mobile-drawer')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('open');
}

function initAuthTabs() {
    document.querySelectorAll('.auth-tab-plain').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.type));
    });
}

window.switchAuthTabFromLink = function(type) { switchAuthTab(type); };

function switchAuthTab(type) {
    const tabs = document.querySelectorAll('.auth-tab-plain');
    const card = document.getElementById('auth-card-inner');
    const titleBlock = document.getElementById('auth-title-block');
    const registerFields = document.getElementById('register-fields');
    const rememberRow = document.getElementById('remember-row');
    const switchText = document.getElementById('auth-switch-text');

    tabs.forEach(t => t.classList.toggle('active', t.dataset.type === type));
    history.replaceState(null, '', type === 'register' ? '/kayit' : '/giris');

    if (card) {
        card.classList.add('auth-switching');
        setTimeout(() => {
            if (registerFields) registerFields.classList.toggle('hidden', type !== 'register');
            if (rememberRow) rememberRow.style.display = type === 'login' ? 'flex' : 'none';
            if (titleBlock) {
                titleBlock.innerHTML = type === 'register'
                    ? '<h2 class="auth-title-text">Hesap Oluştur</h2><p class="auth-subtitle-text">Sunucuya katıl ve efsaneni yazmaya başla</p>'
                    : '<h2 class="auth-title-text">Tekrar hoş geldin</h2><p class="auth-subtitle-text">Hesabına giriş yap ve macerana devam et</p>';
            }
            if (switchText) {
                switchText.innerHTML = type === 'login'
                    ? 'Hesabınız yok mu? <button class="auth-switch-link" onclick="switchAuthTabFromLink(\'register\')">Hemen bir tane oluştur</button>'
                    : 'Hesabın var mı? <button class="auth-switch-link" onclick="switchAuthTabFromLink(\'login\')">Giriş Yap</button>';
            }
            card.classList.remove('auth-switching');
            card.classList.add('auth-switched');
            setTimeout(() => card.classList.remove('auth-switched'), 400);
        }, 280);
    }
}

function initSession() {
    const SK = 'ofc_session_ts';
    if (!localStorage.getItem(SK)) localStorage.setItem(SK, String(Date.now()));
}

let rememberEnabled = false;
window.toggleRemember = function() {
    rememberEnabled = !rememberEnabled;
    const box = document.getElementById('remember-box');
    const check = document.getElementById('remember-check');
    if (box) box.classList.toggle('checked', rememberEnabled);
    if (check) check.classList.toggle('hidden', !rememberEnabled);
};

function injectStore() {
    const grid = document.getElementById('store-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-20 gap-5 text-center">
            <i data-lucide="package-open" style="width:52px;height:52px;color:rgba(116,33,27,0.6);"></i>
            <p class="text-white/70 text-lg font-semibold">Mağaza henüz hazır değil.</p>
            <p class="text-white/35 text-sm max-w-sm leading-relaxed">Yakında VIP paketleri, özel kozmetikler ve çok daha fazlası burada olacak. Takipte kal!</p>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}
