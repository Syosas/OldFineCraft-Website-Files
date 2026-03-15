// ─── INIT ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
    initPageReveal();
    initNav();
    initNavHoverEffect();
    initCopyBtn();
    initMobileMenu();
    initAuthTabs();
    injectStore();
    initRememberMe();
    initSession();
    initHashRouting();
});

// ─── PAGE REVEAL ────────────────────────────────────────────
// İlk yüklemede overlay görünmez, home section inline style ile gösterilir
function initPageReveal() {
    const overlay = document.getElementById('page-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
    // Home section'ı kesin göster — CSS view-section:display:none'dan kurtarmak için
    const home = document.getElementById('view-home');
    if (home) {
        home.style.display = 'block';
        home.style.opacity = '1';
        home.style.transform = 'none';
    }
}

// ─── PAGE TRANSITION ────────────────────────────────────────
function transitionTo(cb) {
    const overlay = document.getElementById('page-overlay');
    overlay.style.transition = 'opacity 0.22s ease';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    setTimeout(() => {
        cb();
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.38s ease';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }, 50);
    }, 230);
}

// ─── NAVIGATION ─────────────────────────────────────────────
let currentView = 'home';

function initNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const target = btn.dataset.target;
        if (!target) return;
        btn.addEventListener('click', () => {
            const authType = btn.dataset.auth || null;
            const scrollTo = btn.dataset.scroll || null;
            closeMobileMenu();
            showView(target, authType, scrollTo);
        });
    });
    document.getElementById('nav-logo')?.addEventListener('click', () => showView('home'));
}

function showView(target, authType = null, scrollTarget = null) {
    if (target === currentView && !scrollTarget && !authType) return;

    transitionTo(() => {
        // Tüm section'ları gizle — inline style ile
        document.querySelectorAll('.view-section').forEach(s => {
            s.classList.remove('active', 'anim-enter');
            s.style.cssText = 'display:none;';
        });

        // Hedefi göster
        const el = document.getElementById('view-' + target);
        if (el) {
            const displayVal = target === 'auth' ? 'flex' : 'block';
            el.style.cssText = `display:${displayVal};opacity:1;transform:none;`;
            el.classList.add('active', 'anim-enter');
            setTimeout(() => el.classList.remove('anim-enter'), 450);
        }

        currentView = target;
        updateNavActive(target, scrollTarget);

        // URL güncelle
        const urlMap = { home: '/', store: '/magaza', bakiye: '/bakiye', bilgiler: '/bilgiler', kurallar: '/kurallar', auth: '/giris' };
        const url = urlMap[target] || '/' + target;
        history.replaceState(null, '', url);

        if (target === 'auth' && authType) {
            switchAuthTab(authType);
        }

        if (scrollTarget) {
            setTimeout(() => {
                const sec = document.getElementById('section-' + scrollTarget);
                if (sec) {
                    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    sec.classList.add('highlight');
                    setTimeout(() => sec.classList.remove('highlight'), 1200);
                }
            }, 350);
        }

        window.scrollTo({ top: 0, behavior: 'instant' });
    });
}

function updateNavActive(target, scrollTarget) {
    document.querySelectorAll('.nav-underline').forEach(btn => {
        const sameTarget = btn.dataset.target === target;
        const sameScroll = scrollTarget ? btn.dataset.scroll === scrollTarget : !btn.dataset.scroll;
        const isActive = sameTarget && sameScroll;
        btn.classList.toggle('active', isActive);
        btn.style.color = isActive ? 'white' : '';
    });
}

// ─── NAV HOVER EFFECT ────────────────────────────────────────
function initNavHoverEffect() {
    const navBtns = document.querySelectorAll('.nav-underline');
    navBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            navBtns.forEach(b => { if (b !== btn) b.classList.add('hover-suppressed'); });
        });
        btn.addEventListener('mouseleave', () => {
            navBtns.forEach(b => b.classList.remove('hover-suppressed'));
        });
    });
}

// ─── COPY IP ─────────────────────────────────────────────────
function initCopyBtn() {
    const btn = document.getElementById('copy-ip-btn');
    const toast = document.getElementById('copy-toast');
    let toastTimer;
    btn?.addEventListener('click', () => {
        navigator.clipboard.writeText('oyna.oldfinecraft.online').then(() => {
            clearTimeout(toastTimer);
            toast.classList.add('show');
            toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
        });
    });
}

// ─── MOBILE MENU ─────────────────────────────────────────────
function initMobileMenu() {
    document.getElementById('hamburger-btn')?.addEventListener('click', () => {
        const isOpen = document.getElementById('mobile-drawer').classList.contains('open');
        isOpen ? closeMobileMenu() : openMobileMenu();
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

// ─── AUTH TABS ───────────────────────────────────────────────
function initAuthTabs() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.type));
    });
}

function switchAuthTab(type) {
    const tabs = document.querySelectorAll('.auth-tab');
    const card = document.getElementById('auth-card-inner');
    const titleBlock = document.getElementById('auth-title-block');
    const registerFields = document.getElementById('register-fields');
    const rememberRow = document.getElementById('remember-row');

    // Tab butonları
    tabs.forEach(t => t.classList.toggle('active', t.dataset.type === type));

    // Kart blur geçiş animasyonu
    if (card) {
        card.classList.add('auth-switching');
        setTimeout(() => {
            // İçerikleri değiştir
            if (registerFields) registerFields.classList.toggle('hidden', type !== 'register');
            if (rememberRow) rememberRow.style.display = type === 'login' ? 'flex' : 'none';
            if (titleBlock) {
                if (type === 'register') {
                    titleBlock.innerHTML = '<h2 class="auth-title-text">Hesap Oluştur</h2><p class="auth-subtitle-text">Sunucuya katıl ve efsaneni yazmaya başla</p>';
                } else {
                    titleBlock.innerHTML = '<h2 class="auth-title-text">Tekrar hoş geldin</h2><p class="auth-subtitle-text">Hesabına giriş yap ve macerana devam et</p>';
                }
            }
            card.classList.remove('auth-switching');
            card.classList.add('auth-switched');
            setTimeout(() => card.classList.remove('auth-switched'), 400);
        }, 280);
    }
}

// ─── SESSION (3 günde bir oturum kapatma) ───────────────────
function initSession() {
    const SESSION_KEY = 'ofc_session_ts';
    const MAX_AGE = 3 * 24 * 60 * 60 * 1000; // 3 gün ms cinsinden
    const now = Date.now();
    const stored = localStorage.getItem(SESSION_KEY);

    if (stored) {
        const age = now - parseInt(stored, 10);
        if (age > MAX_AGE) {
            // Oturum süresi dolmuş — temizle
            localStorage.removeItem('ofc_remember');
            localStorage.removeItem(SESSION_KEY);
        }
    } else {
        localStorage.setItem(SESSION_KEY, String(now));
    }
}

// ─── REMEMBER ME ─────────────────────────────────────────────
let rememberEnabled = false;

function initRememberMe() {
    const saved = localStorage.getItem('ofc_remember');
    if (saved) {
        rememberEnabled = true;
        const userInput = document.querySelector('#auth-form input[type="text"]');
        if (userInput) userInput.value = saved;
        const box = document.getElementById('remember-box');
        const check = document.getElementById('remember-check');
        if (box) box.classList.add('checked');
        if (check) check.classList.remove('hidden');
    }
}

window.toggleRemember = function() {
    rememberEnabled = !rememberEnabled;
    const box = document.getElementById('remember-box');
    const check = document.getElementById('remember-check');
    if (box) box.classList.toggle('checked', rememberEnabled);
    if (check) check.classList.toggle('hidden', !rememberEnabled);
    if (!rememberEnabled) {
        localStorage.removeItem('ofc_remember');
    }
};

// Submit tıklandığında remember me kaydet + session timestamp güncelle
document.addEventListener('click', e => {
    if (e.target.closest('.submit-btn-new')) {
        if (rememberEnabled) {
            const userInput = document.querySelector('#auth-form input[type="text"]');
            if (userInput && userInput.value.trim()) {
                localStorage.setItem('ofc_remember', userInput.value.trim());
                localStorage.setItem('ofc_session_ts', String(Date.now()));
            }
        }
    }
});

// ─── PATH ROUTING ────────────────────────────────────────────
function initHashRouting() {
    const pathMap = { '/magaza': 'store', '/bakiye': 'bakiye', '/bilgiler': 'bilgiler', '/kurallar': 'kurallar', '/giris': 'auth' };
    const path = window.location.pathname;
    if (path && pathMap[path]) {
        showView(pathMap[path]);
    }
}

// ─── STORE ───────────────────────────────────────────────────
function injectStore() {
    const grid = document.getElementById('store-grid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="col-span-1 md:col-span-3 flex items-center justify-center py-24 text-white/30 text-sm">
            Mağaza yakında açılacak...
        </div>
    `;
}
